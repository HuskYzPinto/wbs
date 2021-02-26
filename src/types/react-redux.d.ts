import 'react-redux';
import type { Store } from '../store/type';

declare module 'react-redux' {
	interface DefaultRootState extends Store {}
}
