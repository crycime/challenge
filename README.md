# challenge

---

## 技术栈
开发环境 nodejs 10.15  Mongodb 4.2  docker 18.09.2

nodejs + nestjs + mongodb + mongoose + redis + es6/7 + typescript

[gitHug Action 持续集成](https://github.com/crycime/challenge/blob/main/.github/workflows/test.yml)

## 部署

```bash
$ docker-compose up -d
```

## Development Setup

```bash
# 构建
$ yarn build

# 启动
$ yarn start

# 生产环境启动
$ yarn start:prod

# 代码格式化
$ yarn format

# tslint
$ yarn lint

# 单元测试
$ yarn test:unit

# e2e测试
$ yarn test:e2e

```
## Introduction

**接口文档：[http://localhost:3000/docs/](http://localhost:3000/docs/)**