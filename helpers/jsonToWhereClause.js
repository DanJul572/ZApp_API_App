function parseCondition(condition) {
  const field = condition.field;
  const operator = condition.operator;
  const value = condition.value;

  switch (operator) {
    case '=':
      return `${field} = '${value}'`;
    case '!=':
      return `${field} != '${value}'`;
    case '>':
      return `${field} > '${value}'`;
    case '<':
      return `${field} < '${value}'`;
    case '>=':
      return `${field} >= '${value}'`;
    case '<=':
      return `${field} <= '${value}'`;
    case 'null':
      return `${field} IS NULL`;
    case 'notNull':
      return `${field} IS NOT NULL`;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

function jsonToWhereClause(json) {
  if (json && json.rules && json.rules.length > 0) {
    return `${parseRules(json.rules, json.combinator)}`;
  }
  return '';
}

function parseRules(rules, combinator) {
  const conditions = rules.map(rule => {
    if (rule.rules) {
      return `(${parseRules(rule.rules, rule.combinator)})`;
    } else {
      return parseCondition(rule);
    }
  });

  return conditions.join(` ${combinator.toUpperCase()} `);
}

module.exports = jsonToWhereClause;
