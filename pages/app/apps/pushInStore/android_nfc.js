// import { showModal } from '@/common/utils/MessageUiils.js'
import {
	padStart
} from 'lodash'

// 包路径
const package_TECH_DISCOVERED = 'android.nfc.action.TECH_DISCOVERED';
const package_Intent = 'android.content.Intent';
const package_Activity = 'android.app.Activity';
const package_PendingIntent = 'android.app.PendingIntent';
const package_NfcAdapter = 'android.nfc.NfcAdapter';
const package_Ndef = 'android.nfc.tech.Ndef';
const package_NdefFormatable = 'android.nfc.tech.NdefFormatable';
const package_Parcelable = 'android.os.Parcelable';
const package_String = 'java.lang.String';

let NfcAdapter;
let readyWriteData = false;
let readyRead = false;
let noNFC = false;
let techListsArray = [
	['android.nfc.tech.IsoDep'],
	['android.nfc.tech.NfcA'],
	['android.nfc.tech.NfcB'],
	['android.nfc.tech.NfcF'],
	['android.nfc.tech.Nfcf'],
	['android.nfc.tech.NfcV'],
	['android.nfc.tech.NdefFormatable'],
	['android.nfc.tech.MifareClassi'],
	['android.nfc.tech.MifareUltralight']
];
// 要写入的数据
let readResult = '';
let callback = null;
let nfcAdapter = null;

export default {
	listenNFCStatus: function(callback1) {
		callback = callback1;
		let that = this;
		try {
			let main = plus.android.runtimeMainActivity();
			let Intent = plus.android.importClass('android.content.Intent');
			let Activity = plus.android.importClass('android.app.Activity');
			let PendingIntent = plus.android.importClass('android.app.PendingIntent');
			NfcAdapter = plus.android.importClass('android.nfc.NfcAdapter');
			nfcAdapter = NfcAdapter.getDefaultAdapter(main);

			if (nfcAdapter == null) {
				uni.showToast({
					title: '设备不支持NFC！',
					icon: 'none'
				})
				noNFC = true;
				return;
			}

			if (!nfcAdapter.isEnabled()) {
				uni.showToast({
					title: '请在系统设置中先启用NFC功能！',
					icon: 'none'
				});
				noNFC = true;
				return;
			} else {
				noNFC = false;
			}

			let intent = new Intent(main, main.getClass());
			intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
			let pendingIntent = PendingIntent.getActivity(main, 0, intent, 0);

			plus.globalEvent.addEventListener('newintent', function() {
				callback({
					type: "start"
				})
				// 监听 NFC
				setTimeout(() => {
					that.nfcRuning()
				}, 500);
			});
			plus.globalEvent.addEventListener('pause', function(e) {
				if (nfcAdapter) {
					//关闭前台调度系统
					//恢复默认状态
					console.log("已关闭")
					nfcAdapter.disableForegroundDispatch(main);
				}
			});
			plus.globalEvent.addEventListener('resume', function(e) {
				if (nfcAdapter) {
					//开启前台调度系统
					console.log("已开启")
					nfcAdapter.enableForegroundDispatch(main, pendingIntent, null, null);
				}
			});
			nfcAdapter.enableForegroundDispatch(main, pendingIntent, null, null);
			console.log('open')
		} catch (e) {
			console.error(e);
		}
	},
	removeListener: function() {
		if (nfcAdapter) {
			nfcAdapter.disableForegroundDispatch(plus.android.runtimeMainActivity());
			plus.globalEvent.removeEventListener('newintent');
			plus.globalEvent.removeEventListener('pause');
			plus.globalEvent.removeEventListener('resume');
			callback = null;
		}
	},
	getCallback() {
		return callback;
	},
	nfcRuning: function() {
		try {
			let main = plus.android.runtimeMainActivity();
			let intent = main.getIntent();
			console.log("action type:" + intent.getAction());
			if (intent.getAction() == "android.nfc.action.NDEF_DISCOVERED" || intent.getAction() ==
				"android.nfc.action.TAG_DISCOVERED") {
				this.read(intent);
				readyRead = false;
			}
		} catch (e) {
			console.log('nfcRuning', e)
		}
	},
	async read(intent) {
		try {
			//toast('请勿移开标签正在读取数据');
			let that = this;
			//引入java Tag类
			let tag = plus.android.importClass('android.nfc.Tag');
			//得到意图里面的tag
			tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
			let techlist = tag.getTechList()
			let tagId1 = tag.getId();
			let hex1 = this.byteArrayToHexString(tagId1);
			let nfc_id1 = await this.reverseTwo(hex1);

			// 如果大于4位8字节则切最后8位
			if (nfc_id1.length > 8) {
				nfc_id1 = nfc_id1.substring(nfc_id1.length - 8)
			}
			let hex = this.byteArrayToHexString(tagId1)
			let reverse = await this.reverseTwo(this.byteArrayToHexString(tagId1))

			let nfc_id = JSON.stringify(nfc_id1)


		techlist =  techlist.map(a => a.replace("android.nfc.tech.", ""))
			if (techlist.includes("NfcV")) {
				let temp = reverse
				reverse = tagId
				hex = temp
			}
			let tagId = hex
			console.log("nfc_id", nfc_id)
			// 16进制转10进制
			nfc_id = parseInt(nfc_id1, 16);
			console.log(nfc_id)
			// 补0
			nfc_id = padStart(nfc_id, 10, '0');
			console.log(nfc_id)
			callback({
				type: "end",
				result: {
					tagId,
					nfc_id,
					hex,
					reverse,
					nfc_id,
					techlist
				}
			});
			//toast('nfc_id：'+nfc_id);
		} catch (e) {
			console.log('err', e)
		}
	},
	reverseTwo: (str) => {
		return new Promise(res => {
			let str1 = "";
			for (let i = 1; i <= str.length; i++) {
				str1 += str[i - 1];
				if (i % 2 == 0) {
					if (i == str.length) {
						break;
					}
					str1 += ":";
				}
			}
			let str2 = "";
			for (let i = str1.split(":").length - 1; i >= 0; i--) {
				str2 += str1.split(":")[i];
			}
			res(str2)
		})
	},
	byteArrayToHexString: function(inarray) {
		let i, j, inn;
		let hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
		let out = "";
		let result = ""
		for (j = 0; j < inarray.length; ++j) {
			inn = inarray[j] & 0xff;
			// i = (inn >>> 4) & 0x0f;
			// out += hex[i];
			result = result + hex[(inn >>> 4) & 0x0f] + hex[inn & 0x0f]
			// i = inn & 0x0f;
			// console.log("+", hex[i])
			// out += hex[i];
		}
		console.log(result)
		return result;
	},
	readData: function() {
		if (noNFC) {
			toast('请检查设备是否支持并开启 NFC 功能！');
			return;
		}
		// 监听事件，触发条件
		readyRead = true;
		toast('请将NFC标签靠近！');
	}
}

function toast(content) {
	uni.showToast({
		title: content,
		icon: 'none'
	})
}
