import type { User, UserDto } from '$lib/drizzle/schema';

export class UserTransformer {
	static toDto(user: User): UserDto {
		const { password: _, ...userDto } = user;
		return userDto;
	}
}
