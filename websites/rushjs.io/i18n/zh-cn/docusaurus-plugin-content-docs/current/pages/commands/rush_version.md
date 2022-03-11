---
title: rush version
---

```
用法： rush version [-h] [-b BRANCH] [--ensure-version-policy]
                    [--override-version NEW_VERSION] [--bump]
                    [--bypass-policy] [--version-policy POLICY]
                    [--override-bump BUMPTYPE] [--override-prerelease-id ID]

使用 "rush version" 指令来确保版本策略和变更版本。

可选参数：
  -h, --help            展示帮助信息并退出。
  -b BRANCH, --target-branch BRANCH
                        一旦指定该参数，将会把变更和删除变更的行为提交并合并到指定分
                        支上。
  --ensure-version-policy
                        如果需要满足版本策略，则更新包版本。
  --override-version NEW_VERSION
                        使用指定的 --version-policy 覆盖版本。只有当指定
                        --ensure-version-policy 时，该设置才会对 lock-step
                        版本策略起作用。
  --bump                基于版本策略进行版本变更。policies.
  --bypass-policy       强制覆盖 rush.json 中约定的 "gitPolicy" 规定。
  --version-policy POLICY
                        版本政策的名字
  --override-bump BUMPTYPE
                        在 version-policy.json 中覆盖变更类型。有效的版本变更类型
                        包括：prerelease, patch, preminor, minor,
                        major. 该设定只对 lock-step 版本策略有效。
  --override-prerelease-id ID
                        覆盖 version-policy.json 中的预发布 id. 该设定只对
                        lock-step 版本策略有效。当带有 "--bump" 参数时，该配置
                        会增加预发布 id; 当带有 "--ensure-version-policy"
                        时，该配置会替换预发布名称。
```

## 参考

- [发包](../../maintainer/publishing)
- [rush change](../../commands/rush_change)
- [rush publish](../../commands/rush_publish)
