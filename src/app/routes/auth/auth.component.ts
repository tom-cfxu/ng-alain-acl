import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService, _HttpClient } from '@delon/theme';
import { STChange, STColumn, STComponent, STData, STPage } from '@delon/abc/st';
import { SFSchema, SFComponent } from '@delon/form';
import { HttpService } from 'src/app/services/http.service';
import { StateCode } from 'src/app/enum/statuscode';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  @ViewChild('st2', { static: false }) st2: STComponent;
  @ViewChild('sf', { static: false }) sf: SFComponent;
  @ViewChild('sf1', { static: false }) sf1: SFComponent;
  constructor(private httpSrv: HttpService, private settingSrv: SettingsService, public http: _HttpClient, private msg: NzMessageService) { }
  isVisible: boolean = false;
  isVisible1: boolean = false;
  isVisible2: boolean = false;
  isVisible3: boolean = false;
  roleId: number;
  role: string = '';
  data: any = [];
  data2: any = [];
  data3: any = [];
  selectedPermission: any[] = [];
  columns: STColumn[] = [
    {
      title: '管理', width: 120, buttons: [{
        text: '操作',
        children: [
          {
            text: '编辑角色',
            click: (e) => {
              this.roleId = e.roleId;
              this.role = e.role;
              this.isVisible1 = true;
              this.schema1.properties.roleId.default = e.roleId;
              this.schema1.properties.role.default = e.role;
              this.schema1.properties.description.default = e.description;
              this.schema1.properties.available.default = e.available;
            }
          },
          {
            text: '权限管理',
            click: (e) => {
              this.isVisible2 = true;
              this.roleId = e.roleId;
              this.role = e.role;
              this.getRolePermissionList();
            }
          },
          {
            text: '删除角色',
            type: 'del',
            className: 'text-error',
            iif: (e) => (e.roleId == 1) ? false : true,
            click: (e) => {
              var formdata = new FormData();
              formdata.append("roleId", e.roleId);
              this.httpSrv.api.roledel(formdata).subscribe((res: any) => {
                if (res.code == StateCode.success) {
                  this.getRoleList();
                }
              })
            }
          }
        ]
      }]
    },
    { title: '角色ID', index: 'roleId', width: 80 },
    { title: '角色名称', index: 'role' },
    { title: '可用', index: 'available' },
    { title: '描述', index: 'description' },

  ];
  columns2: STColumn[] = [
    {
      title: 'rolePermissionId',
      index: 'rolePermissionId',
      iif: () => false,
    },
    {
      title: '权限ID',
      index: 'permissionId'
    },
    {
      title: '权限',
      index: 'permission',
    },
    {
      title: '描述',
      index: 'permissionName'
    },
    {
      title: '功能类型',
      index: 'resourceType'
    },
    {
      title: 'url',
      index: 'url'
    },
    {
      title: '角色启用',
      index: 'rolePermissionAvailable',
      render: 'rolePermissionAvailable'
    },
    {
      title: '权限启用',
      index: 'permissionAvailable',
      render: 'permissionAvailable'
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
                "id": i.rolePermissionId,
                "permissionId": i.permissionId,
                "roleId": this.roleId,
                "available": i.userRoleAvailable
              }
            ]
            this.httpSrv.api.rolepermissionsmod(data).subscribe((res: any) => {
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
    }
  ]
  columns3: STColumn[] = [
    {
      type: 'checkbox',
    },
    {
      title: '权限ID',
      index: 'permissionId',
    },
    {
      title: '权限',
      index: 'permission',
    },
    {
      title: '权限名称',
      index: 'permissionName',
    },
    {
      title: '权限类型',
      index: 'resourceType',
    },
    {
      title: 'url',
      index: 'url',
    },
  ]
  // 分页配置
  pages: STPage = {
    showSize: true,
    front: true,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center'
  };
  pages2: STPage = {
    showSize: true,
    front: true,
    pageSizes: [5, 10, 20, 30, 40, 50],
    placement: 'center'
  };
  pages3: STPage = {
    showSize: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center'
  };
  page3: number = 1;
  rows3: number = 10;
  total3: number;
  change(e: STChange) {
    if (e.type == 'pi' || e.type == 'ps') {
      this.page3 = e.pi;
      this.rows3 = e.ps;
      this.getPermissionList();
    }
    if (e.type == 'checkbox') {
      this.selectedPermission = e.checkbox.map((e) => e.permissionId);
      console.log(this.selectedPermission);
    }
  }
  ui = {
    spanLabel: 3,
    spanControl: 9,
  };
  schema: SFSchema = {
    required: ['role', 'description', 'available',],
    properties: {
      role: {
        type: 'string',
        title: '角色名称',
      },
      description: {
        type: 'string',
        title: '描述',
      },
      available: {
        type: 'boolean',
        title: '是否启用',
        default: true,
      },
    }
  }
  schema1: SFSchema = {
    required: ['roleId', 'role', 'description', 'available'],
    properties: {
      role: {
        type: 'string',
        title: '角色名称',
        default: '',
      },
      description: {
        type: 'string',
        title: '描述',
        default: '',
      },
      roleId: {
        type: 'string',
        title: '角色ID',
        readOnly: true,
        default: '',
      },
      available: {
        type: 'boolean',
        title: '是否启用',
        default: true,
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
      case 3:
        this.isVisible3 = false;
        break;
    }

  }
  roleAdd(value): void {
    this.httpSrv.api.roleadd(value).subscribe((res: any) => {
      switch (res.code) {
        case StateCode.success:
          this.isVisible = false;
          this.getRoleList();
          break;
      }
    })
  }
  roleMod(value): void {
    this.httpSrv.api.rolemod(value).subscribe((res: any) => {
      switch (res.code) {
        case StateCode.success:
          this.isVisible1 = false;
          this.getRoleList();
          break;
      }
    })
  }
  ngOnInit(): void {
    this.getRoleList();
  }
  getRoleList() {
    this.httpSrv.api.roleall().subscribe((res: any) => {
      if (res.code == StateCode.success) {
        this.data = [...res.data]
      }
    })
  }
  getRolePermissionList() {
    var formdata = new FormData();
    formdata.append("roleId", `${this.roleId}`);
    this.httpSrv.api.permissionlist(formdata).subscribe((res) => {
      if (res.code == StateCode.success) {
        this.data2 = [...res.data];
        if (this.data2.length == 0) {
          this.msg.info('数据为空', { nzDuration: 1000 })
        }
      }
    })
  }
  getPermissionList() {
    const data = {
      page: this.page3,
      rows: this.rows3,
    }
    this.httpSrv.api.permissionall(data).subscribe((res: any) => {
      if (res.code == StateCode.success) {
        this.total3 = res.data.total;
        this.data3 = res.data.records.map((item) => {
          const disabled = this.data2.filter(e => (e.permissionId).toString() == (item.permissionId).toString()).length > 0 ? true : false;
          return {
            ...item,
            disabled,
          }
        });
      }
    })
  }
  addPermissionBtn() {
    this.page3 = 1;
    this.rows3 = 10;
    this.isVisible3 = true;
    this.getPermissionList()
  }
  private updateEdit(i: STData, edit: boolean): void {
    this.st2.setRow(i, { edit }, { refreshSchema: true });
  }
  rolePermissionAdd() {
    const data = this.selectedPermission.map(e => {
      return {
        roleId: this.roleId,
        permissionId: e,
        available: true
      }
    })
    this.httpSrv.api.rolepermissionsmod(data).subscribe((res: any) => {
      if (res.code === StateCode.success) {
        this.isVisible3 = false;
        this.getRolePermissionList();
      }
    })
  }
}

