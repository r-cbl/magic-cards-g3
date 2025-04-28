export interface PaginationDTO<T> {
    data: T;
    limit?: number;
    offset?: number;
}

export interface PaginatedResponseDTO<T> {
    data: T[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
} 