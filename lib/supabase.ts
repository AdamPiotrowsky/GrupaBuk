// lib/supabase.ts

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kfpertcokbfotlawzdcl.supabase.co';

const supabasePublishableKey = 'sb_publishable_tvDPz9ewhjA3Y-p-sW7Yuw_CpdE66Mh';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);