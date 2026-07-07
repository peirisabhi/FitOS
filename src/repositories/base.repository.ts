/**
 * Generic contract every feature's CRUD repository implements. Services
 * depend on this interface — never on `httpClient` or MSW directly — so
 * a repository can be swapped (e.g. for tests, or a future GraphQL
 * variant) without touching a service or hook.
 *
 * There is deliberately no "mock vs rest" factory here: the repository
 * implementation is written once against the HTTP contract in
 * `lib/http-client.ts`. What answers that HTTP call — MSW or a real
 * NestJS instance — is decided entirely by whether the MSW worker is
 * started (see providers/MockProvider.tsx), gated by
 * `NEXT_PUBLIC_API_MODE`. See architecture doc §1.1 and §7.
 */
export interface ListQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ICrudRepository<TEntity, TCreateDTO, TUpdateDTO> {
  list(params?: ListQueryParams): Promise<PaginatedResult<TEntity>>;
  getById(id: string): Promise<TEntity>;
  create(dto: TCreateDTO): Promise<TEntity>;
  update(id: string, dto: TUpdateDTO): Promise<TEntity>;
  remove(id: string): Promise<void>;
}
