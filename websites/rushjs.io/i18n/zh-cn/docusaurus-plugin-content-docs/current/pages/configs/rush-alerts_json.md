---

---

## title: rush-alerts.json (实验性)

这是[rush init](../commands/rush_init.md)为 Rush 警报功能生成的模板。

> **注意：** 由于此功能为实验性功能，您必须调用 `rush init --include-experiments`。

**common/config/rush/rush-alerts.json**

````js
/**
 * 此配置文件管理Rush警报功能。
 * 更多文档可在Rush网站上查看：https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/rush-alerts.schema.json",

  /**
   * 设置如 `startTime` 和 `endTime` 将使用此时区。
   * 如果省略，默认时区为UTC（`+00:00`）。
   */
  "timezone": "-08:00",

  /**
   * 触发它们的警报消息和条件的数组。
   */
  "alerts": [
    // {
    //   /**
    //    * 当警报显示时，此标题将出现在消息框的顶部。
    //    * 应该是一行文字，尽可能简洁。
    //    */
    //   "title": "Node.js upgrade soon!",
    //
    //   /**
    //    * 当警报显示时，此文本出现在消息框中。为了使JSON文件更易于阅读，如果文本超过一行，
    //    * 你可以提供一个字符串数组，这些字符串将被串联。你的文本可能包含换行符，
    //    * 但通常这是不必要的，因为会自动应用自动换行。
    //    */
    //   "message": [
    //     "This Thursday, we will complete the Node.js version upgrade.  Any pipelines that",
    //     " still have not upgraded will be temporarily disabled."
    //   ],
    //
    //   /**
    //    * （可选）为避免对用户进行轰炸，应尽可能保持 `title` 和 `message` 的简洁。
    //    * 如果需要提供更多细节，使用此设置打印指向具有进一步指导的网页的超链接。
    //    */
    //   // "detailsUrl": "https://contoso.com/team-wiki/2024-01-01-migration",
    //
    //   /**
    //    * （可选）如果指定了 `startTime`，则在该时间之前不会显示此警报。
    //    *
    //    * 请记住，不能保证在此时间或根本就显示警报：
    //    * 只有在Rush命令触发了获取最新的rush-alerts.json配置之后才会显示警报。
    //    * 此外，为避免对用户轰炸太多信息，警报的显示是受到限制的。如果你需要测试你的警报，
    //    * 设置环境变量 `RUSH_ALERTS_DEBUG=1` 来禁用限制。
    //    *
    //    * `startTime` 应指定为 `YYYY-MM-DD HH:MM` 使用24小时格式，
    //    * 或者 `YYYY-MM-DD` 在这种情况下时间部分将是 `00:00`（那天的开始）。
    //    * 时区从上面的 `timezone` 设置获取。
    //    */
    //   // "startTime": "2024-01-01 15:00",
    //
    //   /**
    //    * （可选）如果当前时间晚于 `endTime`，则不会显示此警报。
    //    * 格式与 `startTime` 相同。
    //    */
    //   // "endTime": "2024-01-05",
    //
    //   /**
    //    * （可选）确定是否可以显示此警报的脚本的文件名，
    //    * 位于“common/config/rush/alert-scripts”文件夹中。脚本必须定义
    //    * 一个名为 `canShowAlert` 的CommonJS导出，返回一个布尔值，例如：
    //    *
    //    * ```
    //    * module.exports.canShowAlert = function () {
    //    *   // （你的逻辑在这里）
    //    *   return true;
    //    * }
    //    * ```
    //    *
    //    * Rush将调用此脚本，工作目录设置为monorepo根文件夹，
    //    * 没有保证已运行 `rush install`。为确保警报的最新，Rush
    //    * 可能会在不可预测的临时路径中获取和检出“common/config/rush-alerts”文件夹。
    //    * 因此，你的脚本应避免从其文件夹外部导入依赖，
    //    * 通常应保持尽可能简单、可靠和快速。对于更复杂的条件，
    //    * 我们建议设计一些其他过程来准备一个数据文件或环境变量，
    //    * 该变量可以由你的条件脚本便宜地检查。
    //    */
    //   // "conditionScript": "rush-alert-node-upgrade.js"
    // }
  ]
}
````

## 另见

- [rush init](../commands/rush_init.md)
