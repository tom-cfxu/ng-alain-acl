const notoken = '?_allow_anonymous=true'
export const Api = [
  {
    "api": "login",
    "desc": "登录",
    "url": "/api/iot/user/login",
    "type": "post",
    "header": {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  },
  {
    "api": "logout",
    "desc": "注销",
    "url": "/api/iot/user/logout" + notoken,
    "type": "post",
    "header": {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  },
  {
    "api": "userlist",
    "desc": "用户列表",
    "url": "/api/iot/user/list" + notoken,
    "type": "post",
    "header": {
      "Content-Type": "application/json;charset=utf-8"
    }
  },
  {
    "api": "useradd",
    "desc": "添加用户",
    "url": "/api/iot/user/add" + notoken,
    "type": "post",
    "header": {
      "Content-Type": "application/json;charset=utf-8"
    }
  },
  {
    "api": "usermod",
    "desc": "修改用户",
    "url": "/api/iot/user/mod" + notoken,
    "type": "post",
    "header": {
      "Content-Type": "application/json;charset=utf-8"
    }
  },
  {
    "api": "userdel",
    "desc": "删除用户",
    "url": "/api/iot/user/del" + notoken,
    "type": "post",
    "header": {
    }
  },
  {
    "api": "roleall",
    "desc": "全部角色",
    "url": "/api/iot/role/all" + notoken,
    "type": "post",
    "header": {
      "Content-Type": "application/json;charset=utf-8"
    }
  },
  {
    "api": "roleadd",
    "desc": "添加角色",
    "url": "/api/iot/role/add" + notoken,
    "type": "post",
    "header": {
      "Content-Type": "application/json;charset=utf-8"
    }
  },
  {
    "api": "rolemod",
    "desc": "修改角色",
    "url": "/api/iot/role/mod" + notoken,
    "type": "post",
    "header": {
      "Content-Type": "application/json;charset=utf-8"
    }
  },
  {
    "api": "roledel",
    "desc": "修改角色",
    "url": "/api/iot/role/del" + notoken,
    "type": "post",
    "header": {
    }
  },
  {
    "api": "userrolelist",
    "desc": "用户角色列表",
    "url": "/api/iot/role/userrole/list" + notoken,
    "type": "post",
    "header": {
    }
  },
  {
    "api": "userrolemod",
    "desc": "用户角色修改",
    "url": "/api/iot/role/userrole/mod" + notoken,
    "type": "post",
    "header": {
      "Content-Type": "application/json;charset=utf-8"
    }
  },
  {
    "api": "permissionall",
    "desc": "获取所有权限",
    "url": "/api/iot/permission/all" + notoken,
    "type": "post",
    "header": {
      "Content-Type": "application/json;charset=utf-8"
    }
  },
  {
    "api": "permissionlist",
    "desc": "获取角色所拥有权限",
    "url": "/api/iot/permission/list" + notoken,
    "type": "post",
    "header": {
    }
  },
  {
    "api": "rolepermissionsmod",
    "desc": "更新角色所拥有权限",
    "url": "/api/iot/permission/rolePermissions/mod" + notoken,
    "type": "post",
    "header": {
      "Content-Type": "application/json;charset=utf-8"
    }
  },
]
