const DEFAULT_API_BASE_URL =
	"https://habit-backend-api-gzafhjcjcsf0fdfn.southeastasia-01.azurewebsites.net/api/users";

const BASE_URL = (process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL).replace(
	/\/+$/,
	""
);

export default BASE_URL;
