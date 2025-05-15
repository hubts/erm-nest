/**
 * Basic pagination options for query.
 */
export interface PaginationQuery {
    skip: number;
    take: number;
}

/**
 * Paginated data type.
 */
export interface Paginated<T> {
    total: number; // Total size of all data (Total limit)
    size: number; // Size of data list (Smaller or equal than 'take')
    list: T[]; // Data list
}

/**
 * Examples of type definition for pagination implementation.
 */
export type FindManyAll<T> = () => Paginated<T>;
export type FindManyPaginated<T> = (options: PaginationQuery) => Paginated<T>;
export type FindManyPaginatedAndFiltered<T, R> = (
    options: PaginationQuery & Partial<R>
) => Paginated<T>;
