export interface IFiltersInvoice {
    search?: string
    minDate?: string
    maxDate?: string
    minPrice?: string
    maxPrice?: string
    status?: string
    target?: string
    firstNew?: boolean
    page?: number
    take?: number
}