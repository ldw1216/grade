import * as R from 'ramda';

// function handleChange(component: any, key: string) {
//     return ;
// }

export default function model(component: any, field: string | Array<string | number>) {
    const path = Array.isArray(field) ? field : field.split(/\.|\[/).map((item, index, arr) => {
        if (/^\d+\]$/.test(item)) return parseInt(item, 10);
        return item;
    });
    const value = R.path(path, component.state) as any;
    const prop = {
        onChange(valueOrEvent: any) {
            const val = (typeof valueOrEvent === 'object' && 'target' in valueOrEvent && 'stopPropagation' in valueOrEvent) ? valueOrEvent.target.value : valueOrEvent;
            component.setState({ [path[0]]: R.assocPath(path, val, component.state)[path[0]] });
        },
        value,
    };
    if (typeof value === 'boolean') (prop as any).checked = value;
    return prop;
}

// const aa = { aa: '33' };
// console.log(assocPath(['list[1]', 'dd'], 44, aa ));
