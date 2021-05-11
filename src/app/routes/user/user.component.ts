import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService, _HttpClient } from '@delon/theme';
import { STChange, STColumn, STComponent, STData, STPage } from '@delon/abc/st';
import { SFSchema, SFComponent } from '@delon/form';
import { HttpService } from 'src/app/services/http.service';
import { StateCode } from 'src/app/enum/statuscode';
import * as monent from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  @ViewChild('st2') private st2: STComponent;
  @ViewChild('sf', { static: false }) sf: SFComponent;
  @ViewChild('sf1', { static: false }) sf1: SFComponent;
  constructor(private httpSrv: HttpService, private settingSrv: SettingsService, public http: _HttpClient, private msg: NzMessageService) { }
  isVisible: boolean = false;
  isVisible1: boolean = false;
  isVisible2: boolean = false;
  loading: boolean = false;
  data: any = [];
  data2: any = [];
  roles: any = [];
  selectedRoles: number[] = [];
  columns: STColumn[] = [
    {
      title: '管理',
      width: 80,
      buttons: [
        {
          text: '操作',
          children: [
            {
              text: '编辑用户',
              click: (e) => {
                this.username = e.username;
                this.userId = e.userId;
                this.isVisible1 = true;
                this.schema1.properties.username.default = e.username;
                this.schema1.properties.userId.default = e.userId;
                this.schema1.properties.name.default = e.name;
                this.schema1.properties.state.default = e.state;
                this.schema1.properties.email.default = e.email;
                this.schema1.properties.phone.default = e.phone;
              }
            },
            {
              text: '角色管理',
              click: (e) => {
                this.username = e.username;
                this.userId = e.userId;
                this.getUserRolesList();
                this.isVisible2 = true;
              }
            },
            {
              text: '删除用户',
              type: 'del',
              className: 'text-error',
              iif: (e) => (e.userId == this.settingSrv.user.userId) ? false : true,
              click: (e) => {
                this.loading = true;
                var formdata = new FormData();
                formdata.append("userId", e.userId);
                this.httpSrv.api.userdel(formdata).subscribe((res: any) => {
                  if (res.code == StateCode.success) {
                    if (this.total % this.rows === 1 && this.page > 1) this.page--;
                    this.getUserList();
                  }
                })
              }
            }
          ]

        }
      ]
    },
    { title: '编号', index: 'userId', width: 50 },
    { title: '账号', index: 'username', width: 100, },
    { title: '昵称', index: 'name', width: 100 },
    { title: '电话', index: 'phone', width: 100 },
    { title: '邮箱', index: 'email', width: 120 },
    {
      title: '创建时间', index: 'createTime', width: 120, format: i => {
        const time = monent(i.createTime).format('YYYY-MM-DD HH:mm:ss');
        return time;
      }
    },
    {
      title: '状态',
      width: 80,
      type: 'badge',
      index: 'state',
      badge: {
        0: { text: '关闭', color: 'default' },
        1: { text: '开启', color: 'success' },
      },
    }

  ];
  columns2: STColumn[] = [
    {
      title: '用户ID',
      index: 'userRoleId',
      iif: () => false,
    },
    {
      title: '角色ID',
      index: 'roleId'
    },
    {
      title: '角色名称',
      index: 'role'
    },
    {
      title: '描述',
      index: 'description'
    },
    {
      title: '用户启用',
      index: 'userRoleAvailable',
      render: 'userRoleAvailable'
    },
    {
      title: '角色启用',
      index: 'roleAvailable',
      render: 'roleAvailable'
    },
    {
      title: '管理',
      buttons: [
        {
          text: '编辑',
          iif: i => !i.edit,
          click: i => this.updateEdit(i, true),
        },
        {
          text: '保存',
          iif: i => i.edit,
          click: i => {
            const data = [
              {
                "id": i.userRoleId,
                "userId": this.userId,
                "roleId": i.roleId,
                "available": i.userRoleAvailable
              }
            ]
            this.httpSrv.api.userrolemod(data).subscribe((res: any) => {
              if (res.code === StateCode.success) {
                this.updateEdit(i, false);
                // this.getUserRolesList();
              }
            })
          },
        },
        {
          text: '取消',
          iif: i => i.edit,
          click: i => this.updateEdit(i, false),

        },
      ]
    },
  ]
  // 分页配置
  page = 1;
  rows = 10;
  type = 1;
  total;
  username: string = '';
  userId: number;
  pages: STPage = {
    showSize: true,
    showQuickJumper: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center'
  };
  change(e: STChange) {
    if (e.type == 'pi' || e.type == 'ps') {
      this.page = e.pi;
      this.rows = e.ps;
      this.getUserList();
    }
  }
  ui = {
    spanLabel: 3,
    spanControl: 9,
  };
  schema: SFSchema = {
    required: ['username', 'password', 'name', 'email', 'phone', 'state'],
    properties: {
      username: {
        type: 'string',
        title: '账号',
        minLength: 8,
      },
      password: {
        type: 'string',
        title: '密码',
        minLength: 8,
        ui: {
          type: "password",
        },
      },
      name: {
        type: 'string',
        title: '昵称',
        minLength: 4,
      },
      email: {
        type: 'string',
        title: '邮箱',
        pattern: '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$',
        ui: {
          type: "email",
          errors: { 'pattern': () => '邮箱格式不正确' }
        }
      },
      phone: {
        type: 'string',
        title: '电话',
        ui: {
          type: "phone"
        },
        pattern: '^1[0-9]{10}$'
      },
      expireTime: {
        type: 'string',
        title: '到期时间',
        ui: {
          hidden: true,
        },
        default: '3099-12-31'
      },
      state: {
        type: 'integer',
        title: '启用',
        enum: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
        ui: {
          widget: 'boolean',
        },
        default: 1,
      },
    }
  }
  schema1: SFSchema = {
    required: ['userId', 'username', 'name', 'password', 'state', 'email', 'phone',],
    properties: {
      username: {
        type: 'string',
        title: '账号',
        minLength: 8,
        default: ''
      },
      password: {
        type: 'string',
        title: '密码',
        minLength: 8,
        default: '',
        ui: {
          type: "password",
        },
      },
      name: {
        type: 'string',
        title: '昵称',
        default: '',
        minLength: 4,
      },
      email: {
        type: 'string',
        title: '邮箱',
        default: '',
        pattern: '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$',
        ui: {
          type: "email",
          errors: { 'pattern': () => '邮箱格式不正确' }
        }
      },
      phone: {
        type: 'string',
        title: '电话',
        default: '',
        // ui: {
        //   type: "phone"
        // },
        // pattern: '^1[0-9]{10}$'
      },
      userId: {
        type: 'integer',
        title: '用户ID',
        default: 0,
        readOnly: true,
      },
      state: {
        type: 'integer',
        title: '启用',
        enum: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
        ui: {
          widget: 'boolean',
        },
        default: 1,
      },
    }
  }
  handleCancel(num = 0): void {
    switch (num) {
      case 0:
        this.isVisible = false;
        this.sf.refreshSchema();
        break;
      case 1:
        this.isVisible1 = false;
        break;
      case 2:
        this.isVisible2 = false;
        break;
    }

  }
  userAdd(value): void {
    this.loading = true;
    this.httpSrv.api.useradd(value).subscribe((res: any) => {
      switch (res.code) {
        case StateCode.success:
          this.isVisible = false;
          this.getUserList();
          break;
      }
    })
  }
  userMod(value): void {
    this.loading = true;
    this.httpSrv.api.usermod(value).subscribe((res: any) => {
      switch (res.code) {
        case StateCode.success:
          this.isVisible1 = false;
          this.getUserList();
          break;
      }
    })
  }
  ngOnInit(): void {
    this.getUserList();
    this.getRoleAll();
  }
  getUserList() {
    this.loading = true;
    const data = {
      page: this.page,
      rows: this.rows,
      type: this.type,
    }
    this.httpSrv.api.userlist(data).subscribe((res: any) => {
      if (res.code == StateCode.success) {
        // console.log(res.data)
        this.loading = false;
        this.total = res.data.total;
        this.data = [...res.data.records]

      }
    })
  }
  getUserRolesList() {
    var formdata = new FormData();
    formdata.append("userId", `${this.userId}`);
    this.httpSrv.api.userrolelist(formdata).subscribe((res) => {
      if (res.code == StateCode.success) {
        this.data2 = [...res.data];
        if (this.data2.length == 0) {
          this.msg.info('数据为空', { nzDuration: 1000 })
        }
      }

    })
  }
  userRolesAdd() {
    const data = this.selectedRoles.map(roleId => {
      return {
        userId: this.userId,
        roleId,
        available: true,
      }
    });
    this.httpSrv.api.userrolemod(data).subscribe((res: any) => {
      if (res.code === StateCode.success) {
        this.selectedRoles = [];
        this.getUserRolesList();
      }
    })
  }
  getRoleAll() {
    this.httpSrv.api.roleall().subscribe((res: any) => {
      if (res.code == StateCode.success) {
        this.roles = [...res.data]
      }
    })
  }
  isOptionHide(roleId): boolean {
    return this.data2.filter((e:any) => e.roleId == roleId).length > 0 ? true : false;
  }
  private updateEdit(i: STData, edit: boolean): void {
    this.st2.setRow(i, { edit }, { refreshSchema: true });
  }
}
