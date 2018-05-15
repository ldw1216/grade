import react from 'react'
declare module 'react' {
    export function createContext(defalutVal: any): {Provider: any, Consumer: any}
}