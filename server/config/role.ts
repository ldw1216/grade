// 用户角色
enum Role { 管理员 = '管理员', 评分人 = '评分人', 被评分人 = '被评分人' }

const permissions = {
    [Role.评分人]: [
        {method: 'GET,POST', path: /^\/sign/},
        {method: 'GET', path: /^\/problem/},
        {method: 'GET', path: /^\/period/},
        {method: 'GET,POST', path: /^\/grade\//},
    ]
};

export default Role;
export {
    permissions
};