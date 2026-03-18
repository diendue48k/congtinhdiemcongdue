import { useState, ReactNode, useEffect } from 'react';
import { motion } from 'motion/react';
import { Info, Calculator } from 'lucide-react';
import { COLORS, LIMITS, HE_DAO_TAO } from './constants';
import { AppState } from './types';

export default function App() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Block Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (Mac)
      if ((e.ctrlKey && e.shiftKey && e.key === 'I') || (e.metaKey && e.altKey && e.key === 'i')) {
        e.preventDefault();
      }
      // Block Ctrl+Shift+J (Windows/Linux) or Cmd+Option+J (Mac)
      if ((e.ctrlKey && e.shiftKey && e.key === 'J') || (e.metaKey && e.altKey && e.key === 'j')) {
        e.preventDefault();
      }
      // Block Ctrl+U (Windows/Linux) or Cmd+Option+U (Mac)
      if ((e.ctrlKey && e.key === 'u') || (e.metaKey && e.altKey && e.key === 'u')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [state, setState] = useState<AppState>({
    isPT1: false,
    olympia: false,
    hsgQuocGia: false,
    hsgTinh: false,
    khktQuocGia: false,
    khktTinh: false,
    hsXuatSac: false,
    khoiNghiepNhatNhiBa: false,
    tinHocTreNhatNhiBa: false,
    olympic: false,
    theThao: false,
    startupDueNhatNhiBa: false,
    hsgDuyenHai: false,
    hsgKkTinh: false,
    khktKkTinh: false,
    hsGioi: false,
    khoiNghiepKk: false,
    tinHocTreKk: false,
    startupDueKk: false,
    tinHocQuocTe: '',
    sat: 0,
    act: 0,
    ngoaiNgu: 0,
    heDaoTao: 'tieu_chuan',
  });

  const [showConversion, setShowConversion] = useState(false);

  // --- CALCULATIONS ---

  // Group 1
  const diemThuong = state.isPT1 ? LIMITS.DIEM_THUONG : 0;

  // Group 2
  const max2_1 = state.hsXuatSac ? 1.5 : (state.hsGioi ? 1.0 : 0);
  const max2_2 = (state.hsgQuocGia || state.hsgTinh || state.olympic || state.hsgDuyenHai) ? 1.5 : (state.hsgKkTinh ? 1.0 : 0);
  const max2_3 = (state.khktQuocGia || state.khktTinh) ? 1.5 : (state.khktKkTinh ? 1.0 : 0);
  const max2_4 = (state.khoiNghiepNhatNhiBa || state.tinHocTreNhatNhiBa || state.startupDueNhatNhiBa) ? 1.5 : ((state.khoiNghiepKk || state.tinHocTreKk || state.startupDueKk) ? 1.0 : 0);
  const max2_5 = state.theThao ? 1.5 : 0;
  const max2_6 = state.olympia ? 1.5 : 0;

  const diemXetThuong = Math.min(max2_1 + max2_2 + max2_3 + max2_4 + max2_5 + max2_6, LIMITS.DIEM_XET_THUONG);

  // Group 3
  const max3_1 = state.heDaoTao === 'tieu_chuan' ? 0 : state.ngoaiNgu;
  const max3_2 = state.tinHocQuocTe !== '' ? 1.5 : 0;
  const max3_3 = state.sat;
  const max3_4 = state.act;

  const diemKhuyenKhich = Math.min(max3_1 + max3_2 + max3_3 + max3_4, LIMITS.DIEM_KHUYEN_KHICH);

  // Total
  const tongDiemCong = Math.min(diemThuong + diemXetThuong + diemKhuyenKhich, LIMITS.TONG_DIEM_CONG);

  // --- HANDLERS ---
  const handleStateChange = (key: keyof AppState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const CheckboxItem = ({ label, stateKey, colorClass }: { label: string, stateKey: keyof AppState, colorClass: string }) => (
    <label className="flex items-start gap-3 cursor-pointer group py-2">
      <input 
        type="checkbox" 
        className={`mt-0.5 shrink-0 w-5 h-5 rounded border-slate-300 ${colorClass}`} 
        checked={state[stateKey] as boolean} 
        onChange={(e) => handleStateChange(stateKey, e.target.checked)} 
      />
      <span className="text-[13px] sm:text-sm text-slate-700 group-hover:text-slate-900 transition-colors leading-snug">{label}</span>
    </label>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
          <div className="font-bold text-xl sm:text-2xl tracking-tighter flex shrink-0">
            <span style={{ color: COLORS.orange }}>D</span>
            <span style={{ color: COLORS.green }}>U</span>
            <span style={{ color: COLORS.blue }}>E</span>
          </div>
          <div className="h-5 sm:h-6 w-px bg-slate-300"></div>
          <h1 className="font-bold text-xs sm:text-lg leading-tight uppercase text-slate-800 line-clamp-2">
            Hệ thống hỗ trợ thí sinh tính điểm cộng
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Box Header */}
              <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-200 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-slate-700" />
                <h2 className="font-bold text-slate-800 uppercase">Tính điểm cộng</h2>
              </div>

              <div className="p-6 space-y-8">

                {/* CÁCH TÍNH */}
                <div 
                  className="rounded-lg px-3.5 py-2.5 flex items-start sm:items-center gap-2.5 text-[13px] sm:text-sm border shadow-sm"
                  style={{ backgroundColor: COLORS.orangeLight, borderColor: `${COLORS.orange}40`, color: COLORS.orange }}
                >
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 sm:mt-0" strokeWidth={2.5} />
                  <div className="leading-snug">
                    <span className="font-bold uppercase tracking-wide">Cách tính:</span> <span className="font-medium">Điểm cộng = Điểm thưởng + Điểm xét thưởng + Điểm khuyến khích</span>
                  </div>
                </div>

                {/* ĐIỂM THƯỞNG */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-sm uppercase leading-tight" style={{ color: COLORS.orange }}>
                      ĐIỂM THƯỞNG <span className="block sm:inline text-xs font-medium opacity-80 normal-case mt-0.5 sm:mt-0">(Tối đa {LIMITS.DIEM_THUONG.toFixed(1)})</span>
                    </h3>
                    <div className="font-bold text-sm whitespace-nowrap px-2.5 py-1 rounded-md shrink-0" style={{ backgroundColor: COLORS.orangeLight, color: COLORS.orange }}>
                      Đạt: {diemThuong.toFixed(2)}
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mt-0.5 shrink-0 w-5 h-5 rounded border-slate-300 text-[#F26522] focus:ring-[#F26522]"
                        checked={state.isPT1}
                        onChange={(e) => handleStateChange('isPT1', e.target.checked)}
                      />
                      <span className="text-sm font-medium text-slate-700 leading-snug">Đủ điều kiện Xét tuyển thẳng Phương thức 1 nhưng không dùng (+3.0 điểm)</span>
                    </label>
                  </div>
                </div>

                {/* ĐIỂM XÉT THƯỞNG */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-sm uppercase leading-tight" style={{ color: COLORS.green }}>
                      ĐIỂM XÉT THƯỞNG <span className="block sm:inline text-xs font-medium opacity-80 normal-case mt-0.5 sm:mt-0">(Tối đa {LIMITS.DIEM_XET_THUONG.toFixed(1)})</span>
                    </h3>
                    <div className="font-bold text-sm whitespace-nowrap px-2.5 py-1 rounded-md shrink-0" style={{ backgroundColor: COLORS.greenLight, color: COLORS.green }}>
                      Đạt: {diemXetThuong.toFixed(2)}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cột 1.5 điểm */}
                    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">Cộng 1,5 điểm cho mỗi thành tích sau</h4>
                      <div className="space-y-1">
                        <CheckboxItem label="Thí sinh đã tham gia cuộc thi “Đường lên đỉnh Olympia” trên Đài truyền hình Việt Nam." stateKey="olympia" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt giải Khuyến khích kỳ thi học sinh giỏi cấp Quốc gia, hoặc giải Nhất, Nhì, Ba kỳ thi học sinh giỏi THPT cấp tỉnh, thành phố trực thuộc trung ương." stateKey="hsgQuocGia" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt giải Nhất, Nhì, Ba, Tư cuộc thi khoa học, kỹ thuật cấp quốc gia; hoặc đạt giải Nhất, Nhì, Ba cuộc thi khoa học, kỹ thuật cấp tỉnh, thành phố trực thuộc trung ương." stateKey="khktQuocGia" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt danh hiệu “Học sinh Xuất sắc” cả 03 năm học THPT (lớp 10, lớp 11 và lớp 12)." stateKey="hsXuatSac" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt giải Nhất, Nhì, Ba cuộc thi “Học sinh, sinh viên với ý tưởng khởi nghiệp” do Bộ Giáo dục và Đào tạo tổ chức." stateKey="khoiNghiepNhatNhiBa" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt giải Nhất, Nhì, Ba vòng Chung kết Hội thi Tin học trẻ toàn quốc do Trung ương Đoàn TNCS Hồ Chí Minh tổ chức." stateKey="tinHocTreNhatNhiBa" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt Huy chương Vàng, Bạc, Đồng kỳ thi Olympic truyền thống 30/4." stateKey="olympic" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt Huy chương Vàng, Bạc, Đồng kỳ thi chọn học sinh giỏi các trường THPT chuyên khu vực Duyên hải và Đồng bằng Bắc bộ." stateKey="hsgDuyenHai" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh được công nhận là Vận động viên Kiện tướng Quốc gia; hoặc đạt Huy chương Vàng, Bạc, Đồng cấp Quốc gia; hoặc đạt Huy chương Vàng, Bạc, Đồng tại Hội khỏe Phù Đổng từ cấp tỉnh, thành phố trực thuộc Trung ương trở lên (Thời gian đạt giải không quá 4 năm)." stateKey="theThao" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt giải Nhất, Nhì, Ba cuộc thi Startup Runway do Trường Đại học Kinh tế - Đại học Đà Nẵng tổ chức." stateKey="startupDueNhatNhiBa" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                      </div>
                    </div>
                    {/* Cột 1.0 điểm */}
                    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">Cộng 1,0 điểm cho mỗi thành tích sau</h4>
                      <div className="space-y-1">
                        <CheckboxItem label="Thí sinh đạt giải Khuyến khích kỳ thi học sinh giỏi THPT cấp tỉnh, thành phố trực thuộc trung ương." stateKey="hsgKkTinh" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt giải Tư cuộc thi khoa học, kỹ thuật cấp tỉnh, thành phố trực thuộc trung ương." stateKey="khktKkTinh" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt danh hiệu “Học sinh Giỏi” (hoặc kết hợp danh hiệu “Học sinh Xuất sắc” và “Học sinh Giỏi”) cả 03 năm học THPT (lớp 10, lớp 11 và lớp 12)." stateKey="hsGioi" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt giải Khuyến khích cuộc thi “Học sinh, sinh viên với ý tưởng khởi nghiệp” do Bộ Giáo dục và Đào tạo tổ chức." stateKey="khoiNghiepKk" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt giải Khuyến khích Vòng Chung kết Hội thi Tin học trẻ toàn quốc do Trung ương Đoàn TNCS Hồ Chí Minh tổ chức." stateKey="tinHocTreKk" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                        <CheckboxItem label="Thí sinh đạt giải Khuyến khích cuộc thi Startup Runway do Trường Đại học Kinh tế - Đại học Đà Nẵng tổ chức." stateKey="startupDueKk" colorClass="text-[#009A44] focus:ring-[#009A44]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ĐIỂM KHUYẾN KHÍCH */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-sm uppercase leading-tight" style={{ color: COLORS.blue }}>
                      ĐIỂM KHUYẾN KHÍCH <span className="block sm:inline text-xs font-medium opacity-80 normal-case mt-0.5 sm:mt-0">(Tối đa {LIMITS.DIEM_KHUYEN_KHICH.toFixed(1)})</span>
                    </h3>
                    <div className="font-bold text-sm whitespace-nowrap px-2.5 py-1 rounded-md shrink-0" style={{ backgroundColor: COLORS.blueLight, color: COLORS.blue }}>
                      Đạt: {diemKhuyenKhich.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Loại hình đào tạo</label>
                      <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#005A9C] outline-none"
                        value={state.heDaoTao}
                        onChange={(e) => handleStateChange('heDaoTao', e.target.value)}
                      >
                        {HE_DAO_TAO.map(he => (
                          <option key={he.value} value={he.value}>{he.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700">Chứng chỉ Ngoại ngữ</label>
                        <button onClick={() => setShowConversion(true)} className="text-[10px] text-[#005A9C] hover:underline flex items-center gap-0.5"><Info className="w-3 h-3"/> Quy đổi</button>
                      </div>
                      <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#005A9C] outline-none"
                        value={state.ngoaiNgu}
                        onChange={(e) => handleStateChange('ngoaiNgu', parseFloat(e.target.value))}
                      >
                        <option value={0}>Không có</option>
                        <option value={1.0}>Bậc 3 (Ví dụ: IELTS 5.0 - 5.5) (+1.0 điểm)</option>
                        <option value={1.5}>Bậc 4 trở lên (Ví dụ: IELTS 6.0+) (+1.5 điểm)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4 text-xs italic text-red-600">
                    * Không cộng điểm chứng chỉ ngoại ngữ đối với loại hình đào tạo tiêu chuẩn.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Chứng chỉ Tin học</label>
                      <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#005A9C] outline-none"
                        value={state.tinHocQuocTe}
                        onChange={(e) => handleStateChange('tinHocQuocTe', e.target.value)}
                      >
                        <option value="">Không có</option>
                        <option value="MOS">MOS (+1.5 điểm)</option>
                        <option value="IC3">IC3 (+1.5 điểm)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Chứng chỉ SAT</label>
                      <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#005A9C] outline-none"
                        value={state.sat}
                        onChange={(e) => handleStateChange('sat', parseFloat(e.target.value))}
                      >
                        <option value={0}>Không có</option>
                        <option value={1.0}>1100 &lt;= SAT &lt; 1300 (+1.0 điểm)</option>
                        <option value={1.5}>SAT &gt;= 1300 (+1.5 điểm)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Chứng chỉ ACT</label>
                      <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#005A9C] outline-none"
                        value={state.act}
                        onChange={(e) => handleStateChange('act', parseFloat(e.target.value))}
                      >
                        <option value={0}>Không có</option>
                        <option value={1.0}>22 &lt;= ACT &lt; 28 (+1.0 điểm)</option>
                        <option value={1.5}>ACT &gt;= 28 (+1.5 điểm)</option>
                      </select>
                    </div>
                  </div>

                </div>

                <a 
                  href="https://due.udn.vn/vi-vn/tuvantuyensinh2026/gt/cid/5973" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="rounded-lg px-3.5 py-2.5 flex items-start sm:items-center gap-2.5 text-[13px] sm:text-sm border shadow-sm hover:opacity-80 transition-opacity cursor-pointer block"
                  style={{ backgroundColor: COLORS.blueLight, borderColor: `${COLORS.blue}40`, color: COLORS.blue }}
                >
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 sm:mt-0" strokeWidth={2.5} />
                  <div className="leading-snug">
                    <span className="font-medium">Thông tin chi tiết các Phương thức xét tuyển, Loại hình đào tạo vui lòng xem <span className="font-bold underline underline-offset-2">tại đây</span>.</span>
                  </div>
                </a>

              </div>
            </div>

          </div>

          {/* Result Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-[#009A44] to-[#005A9C] text-white text-center">
                  <h2 className="text-sm font-medium text-white uppercase tracking-widest mb-2">Điểm cộng</h2>
                  <div className="text-6xl font-light tracking-tighter drop-shadow-sm">
                    {tongDiemCong.toFixed(2)}
                  </div>
                  <div className="text-sm text-white mt-2">Tối đa 3.0 điểm</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-sm text-slate-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.orange }}></div> Điểm thưởng</span>
                    <span className="font-semibold text-slate-900">{diemThuong.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-sm text-slate-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.green }}></div> Điểm xét thưởng</span>
                    <span className="font-semibold text-slate-900">{diemXetThuong.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.blue }}></div> Điểm khuyến khích</span>
                    <span className="font-semibold text-slate-900">{diemKhuyenKhich.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                <h4 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2"><Info className="w-4 h-4"/> Lưu ý quan trọng</h4>
                <ul className="text-xs text-blue-800 space-y-2 list-disc pl-4">
                  <li>Hệ thống tự động chọn điểm cao nhất trong các nhóm thành tích để tối ưu quyền lợi cho thí sinh.</li>
                  <li>Điểm cộng chỉ có giá trị khi thí sinh nộp đầy đủ minh chứng hợp lệ.</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#009A44] to-[#005A9C] text-white shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.15)] z-40 p-4 pb-safe">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <div className="text-xs font-medium text-white uppercase tracking-wider mb-0.5">Điểm cộng</div>
            <div className="text-xs text-white">Tối đa 3.0 điểm</div>
          </div>
          <div className="text-3xl font-bold text-white drop-shadow-sm">
            {tongDiemCong.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showConversion && (
        <Modal title="Bảng Quy đổi Chứng chỉ Ngoại ngữ" onClose={() => setShowConversion(false)}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center text-slate-700 border-collapse">
              <thead className="text-xs text-white uppercase bg-[#E87722]">
                <tr>
                  <th rowSpan={2} className="px-2 py-3 border border-white/20 align-middle">KNLNN<br/>VN</th>
                  <th rowSpan={2} className="px-2 py-3 border border-white/20 align-middle">IELTS<br/>Academic</th>
                  <th rowSpan={2} className="px-2 py-3 border border-white/20 align-middle">TOEFL iBT<br/>(*)</th>
                  <th rowSpan={2} className="px-2 py-3 border border-white/20 align-middle">TOEFL<br/>ITP</th>
                  <th colSpan={4} className="px-2 py-2 border border-white/20 text-center">TOEIC</th>
                  <th rowSpan={2} className="px-2 py-3 border border-white/20 align-middle">VSTEP</th>
                </tr>
                <tr>
                  <th className="px-2 py-2 border border-white/20">Nghe</th>
                  <th className="px-2 py-2 border border-white/20">Đọc</th>
                  <th className="px-2 py-2 border border-white/20">Nói</th>
                  <th className="px-2 py-2 border border-white/20">Viết</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#E87722] text-white font-medium">
                  <td className="px-2 py-3 border border-white/20">Bậc 3</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCD5B4] text-slate-800">4,0-5,0</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCD5B4] text-slate-800">30-45</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCD5B4] text-slate-800">450-499</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">275-<br/>395</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">275-<br/>380</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">120-<br/>150</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">120-<br/>140</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCD5B4] text-slate-800">4,0-5,5</td>
                </tr>
                <tr className="bg-[#E87722] text-white font-medium">
                  <td className="px-2 py-3 border border-white/20">Bậc 4</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCD5B4] text-slate-800">5,5-6,5</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCD5B4] text-slate-800">46-93</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCD5B4] text-slate-800">500-626</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">400-<br/>485</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">385-<br/>450</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">160-<br/>170</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">150-<br/>170</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCD5B4] text-slate-800">6,0-8,0</td>
                </tr>
                <tr className="bg-[#E87722] text-white font-medium">
                  <td className="px-2 py-3 border border-white/20">Từ Bậc 5</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">&ge; 7,0</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">&ge; 94</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">&ge; 627</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">&ge; 490</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">&ge; 455</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">&ge; 180</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">&ge; 180</td>
                  <td className="px-2 py-3 border border-white/20 bg-[#FCE4D6] text-slate-800">&ge; 8,5</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3 text-[11px] text-slate-600 italic">
              * Không chấp nhận phiên bản Home Edition. Các chứng chỉ tiếng Anh trong thời hạn 2 năm, tính đến ngày nộp hồ sơ ĐKXT.
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}

// Simple Modal Component
function Modal({ title, children, onClose }: { title: string, children: ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-lg text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">Đóng</button>
        </div>
      </motion.div>
    </div>
  );
}