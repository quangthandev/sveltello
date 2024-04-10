interface DatabaseUserAttributes {
	email: string;
}

interface DatabaseSessionAttributes {
	created_at: Date;
	updated_at: Date;
}

const adapterOptions = {
	user: 'User',
	session: 'Session'
};

const generateUserAttributes = (data: DatabaseUserAttributes) => {
	return {
		email: data.email
	};
};

const generateSessionAttributes = (data: DatabaseSessionAttributes) => {
	return {
		createdAt: data.created_at,
		updatedAt: data.updated_at
	};
};

export {
	adapterOptions,
	generateSessionAttributes,
	generateUserAttributes,
	type DatabaseSessionAttributes,
	type DatabaseUserAttributes
};
