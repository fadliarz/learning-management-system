export default class DynamoDBBuilder {
  constructor() {}

  public static buildUpdate(obj: object):
    | {
        UpdateExpression: string;
        ExpressionAttributeNames: Record<string, string>;
        ExpressionAttributeValues: Record<string, string>;
      }
    | undefined {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, string> = {};

    let count: number = 0;
    Object.entries(obj).forEach(([key, value], index) => {
      if (value === undefined) {
        return;
      }
      count++;
      const placeholder = `#field${index}`;
      const valuePlaceholder = `:value${index}`;
      updateExpressions.push(`${placeholder} = ${valuePlaceholder}`);
      expressionAttributeNames[placeholder] = key;
      expressionAttributeValues[valuePlaceholder] = value;
    });

    return count == 0
      ? {
          UpdateExpression: `SET ${updateExpressions.join(', ')}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
        }
      : undefined;
  }
}
