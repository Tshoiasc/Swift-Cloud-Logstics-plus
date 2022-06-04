// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "create_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  },
  "info": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "is_refund": {
    "rules": [
      {
        "format": "bool"
      }
    ]
  },
  "paid_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  },
  "pay_type": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "platform": {
    "rules": [
      {
        "format": "String"
      }
    ]
  },
  "refund_amount": {
    "rules": [
      {
        "format": "int"
      }
    ]
  },
  "refund_count": {
    "rules": [
      {
        "format": "int"
      }
    ]
  },
  "refund_desc": {
    "rules": [
      {
        "format": "String"
      }
    ]
  },
  "refund_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  },
  "status": {
    "rules": [
      {
        "format": "int"
      },
      {
        "minimum": -3,
        "maximum": 5
      }
    ]
  },
  "title": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "total_fee": {
    "rules": [
      {
        "format": "int"
      }
    ]
  },
  "transaction_id": {
    "rules": [
      {
        "format": "String"
      }
    ]
  },
  "type": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "update_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  }
}

const enumConverter = {}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
