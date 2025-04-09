// 'use client';

// import React from 'react';
// import TimePicker from 'react-time-picker';
// import 'react-time-picker/dist/TimePicker.css';
// import 'react-clock/dist/Clock.css';

// export default function CustomTimePicker({
//   value,
//   onChange,
//   placeholder = 'Chọn giờ',
// }: {
//   value: Date | null;
//   onChange: (value: string | null) => void;
//   placeholder?: string;
// }) {
//   return (
//     <div className="w-full">
//       <TimePicker

//         onChange={onChange}
//         value={value}
//         disableClock
//         clearIcon={null}
//         clockIcon={null}
//         format="HH:mm"
//         className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
//       />
//     </div>
//   );
// }
