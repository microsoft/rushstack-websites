import dayjs from 'dayjs';
import dayjsUtc from 'dayjs/plugin/utc';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsAdvancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsAdvancedFormat);
