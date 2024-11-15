import path from 'path';
import urlPackage from 'url';

const __filename = urlPackage.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    __dirname,
    __filename
}