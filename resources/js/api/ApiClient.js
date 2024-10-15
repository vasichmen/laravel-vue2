import BaseClient from './BaseClient';
import authRoutes from './routes/auth';
import textEditorRoutes from './routes/text-editor';

class ApiClient extends BaseClient {}

Object.assign(ApiClient.prototype, authRoutes);
Object.assign(ApiClient.prototype, textEditorRoutes);

const Api = new ApiClient();
export default Api;
