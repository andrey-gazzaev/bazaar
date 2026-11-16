/** Label a listing can carry. */
export type TagDto = {
  /** Tag id. */
  readonly id: string;

  /** Unique label shown on the listing. */
  readonly name: string;
};

/** Shape stored for a tag. */
export function toTag(tag: { id: string; name: string }): TagDto {
  return { id: tag.id, name: tag.name };
}
