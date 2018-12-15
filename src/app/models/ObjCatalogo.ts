export interface ObjCatalogo {
    tiposIdentificacion?: SelectList[],
    tratamientos?: SelectList[],
    doctores?: SelectList[],
    ciudades?: SelectList[],
    clinicas?: SelectList[],
    roles?: number[]
}

export interface SelectList {
    value?: string,
    viewValue?: string,
    parent?: string
}