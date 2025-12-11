import type { Locale } from "./config";

export const baseTranslations = {
  vi: {
    "header.brand": "tocdovps.dev",
    "header.nav.about": "Trang chủ",
    "header.nav.howItWorks": "Cách hoạt động",
    "header.nav.leaderboard": "Bảng xếp hạng",
    "header.locale.vi": "VI",
    "header.locale.en": "EN",
    "hero.title": "Đánh giá tốc độ VPS một cách minh bạch",
    "hero.subtitle":
      "tocdovps.dev là dự án cá nhân giúp bạn nhìn rõ hiệu năng thực tế của các gói VPS: độ trễ, tốc độ mạng, I/O… được kiểm tra và trình bày một cách dễ hiểu. Bắt đầu benchmark VPS của bạn với tocdovps.dev.",
    "hero.ctaPrimary": "Khám phá benchmark (Coming soon)",
    "hero.ctaSecondary": "Tài liệu",
    "hero.ctaPrimaryNote": "Bắt đầu benchmark VPS của bạn với tocdovps.dev.",
    "hero.scriptLabel": "Chạy benchmark trên VPS của bạn",
    "hero.copyButton": "Sao chép script",
    "hero.copiedButton": "Đã sao chép",
    "hero.benchmarkCount": "Tổng số benchmark: {count}",
    "features.title": "Tính năng",
    "features.landingPage.title": "Landing page",
    "features.landingPage.description":
      "Trang chủ giới thiệu dự án và hướng dẫn sử dụng.",
    "features.leaderboard.title": "Bảng tổng hợp kết quả benchmark",
    "features.leaderboard.description":
      "Xem chi tiết các kết quả benchmark với sorting và pagination.",
    "features.auth.title": "Xác thực người dùng",
    "features.auth.description":
      "Đăng nhập với credentials, Google, GitHub (đang phát triển).",
    "features.customScript.title": "Script cá nhân hóa",
    "features.customScript.description":
      "Đa dạng lựa chọn speedtest, phần cứng (đang phát triển).",
    "features.notifications.title": "Thông báo tự động",
    "features.notifications.description":
      "Gửi kết quả về Telegram, Discord, Email (đang phát triển).",
    "features.compare.title": "So sánh VPS",
    "features.compare.description":
      "So sánh hiệu năng giữa các VPS khác nhau (đang phát triển).",
    "features.badge.available": "Có sẵn",
    "features.badge.comingSoon": "Sắp ra mắt",
    "banner.howItWorks.title": "Cách hoạt động",
    "banner.howItWorks.step1.title": "Bước 1 – Thu thập thông tin",
    "banner.howItWorks.step1.body":
      "Chọn gói VPS, nhà cung cấp và khu vực test.",
    "banner.howItWorks.step2.title": "Bước 2 – Chạy bài test",
    "banner.howItWorks.step2.body":
      "Chạy các bài test về ping, băng thông mạng, I/O đĩa trên môi trường thật.",
    "banner.howItWorks.step3.title": "Bước 3 – Tổng hợp & xếp hạng",
    "banner.howItWorks.step3.body":
      "Chuẩn hóa kết quả, tính điểm tổng và hiển thị trong bảng xếp hạng dễ đọc.",
    "banner.demo.title": "Demo bảng xếp hạng (dữ liệu minh họa)",
    "banner.demo.note":
      "Đây là dữ liệu demo cho phần giao diện, chưa phải kết quả test thật.",
    "footer.note":
      "Dự án cá nhân, đang trong giai đoạn phát triển tính năng benchmark thực tế.",
    "footer.links.title": "Liên kết",
    "footer.links.home": "Trang chủ",
    "footer.links.leaderboard": "Bảng xếp hạng",
    "footer.links.howItWorks": "Cách hoạt động",
    "footer.social.title": "Liên hệ",
    "footer.social.website": "hophamlam.com",
    "footer.copyright": "© {year} tocdovps.dev",
    "footer.copyright.builtBy": "Được phát triển bởi",
    "footer.copyright.sourceCode": "Mã nguồn mở tại",
    "latestBenchmarks.title": "Kết quả benchmark mới nhất",
    "latestBenchmarks.description":
      "Một số lần chạy gần đây được báo cáo từ script CLI.",
    "latestBenchmarks.table.time": "Thời gian (UTC)",
    "latestBenchmarks.table.label": "Nhãn",
    "latestBenchmarks.table.ping": "Ping trung bình (ms)",
    "latestBenchmarks.table.download": "Tải xuống (Mbps)",
    "latestBenchmarks.table.score": "Điểm",
    "latestBenchmarks.empty": "Chưa có kết quả benchmark nào.",
    "latestBenchmarks.emptyDescription":
      "Chạy script benchmark trên VPS của bạn để xem kết quả ở đây.",
    "stats.subtitle":
      "Thống kê nhanh từ các kết quả benchmark đã được gửi lên hệ thống.",
    "stats.totalRuns": "Tổng số lần benchmark",
    "stats.avgScore": "Điểm trung bình",
    "stats.avgDownload": "Tốc độ tải xuống trung bình",
    "leaderboard.title": "Bảng xếp hạng",
    "leaderboard.description":
      "Xem các kết quả benchmark được sắp xếp theo điểm số, tốc độ tải xuống, ping hoặc thời gian.",
    "leaderboard.sortBy": "Sắp xếp theo",
    "leaderboard.sort.score": "Điểm số",
    "leaderboard.sort.download": "Tốc độ tải",
    "leaderboard.sort.ping": "Ping",
    "leaderboard.sort.date": "Ngày",
    "leaderboard.table.time": "Thời gian",
    "leaderboard.table.label": "Nhãn",
    "leaderboard.table.ping": "Ping (ms)",
    "leaderboard.table.download": "Tải xuống (Mbps)",
    "leaderboard.table.score": "Điểm",
    "leaderboard.empty": "Chưa có kết quả benchmark nào.",
    "leaderboard.emptyDescription":
      "Chạy script benchmark trên VPS của bạn để xem kết quả ở đây.",
    "leaderboard.pagination.showing":
      "Hiển thị {start}-{end} trong tổng {total}",
    "leaderboard.pagination.previous": "Trước",
    "leaderboard.pagination.next": "Sau",
    "result.title": "Chi tiết kết quả benchmark",
    "result.description":
      "Xem thông tin chi tiết và dữ liệu thô của lần benchmark này.",
    "result.backToLeaderboard": "Quay lại bảng xếp hạng",
    "result.summary.title": "Tóm tắt",
    "result.summary.time": "Thời gian",
    "result.summary.serverLabel": "Nhãn server",
    "result.summary.avgPing": "Ping trung bình",
    "result.summary.downloadSpeed": "Tốc độ tải xuống",
    "result.summary.score": "Điểm số",
    "result.summary.sourceIp": "IP nguồn",
    "result.rawPayload.title": "Dữ liệu thô (Raw Payload)",
    "result.rawPayload.description":
      "Toàn bộ dữ liệu JSON được gửi từ script benchmark.",
    "error.notFound.title": "Trang không tìm thấy",
    "error.notFound.description":
      "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
    "error.notFound.backHome": "Về trang chủ",
    "error.notFound.viewLeaderboard": "Xem bảng xếp hạng",
    "error.generic.title": "Đã xảy ra lỗi",
    "error.generic.description":
      "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
    "error.generic.retry": "Thử lại",
    "error.generic.backHome": "Về trang chủ",
    "header.nav.docs": "Tài liệu",
    "docs.title": "Tài liệu hướng dẫn",
    "docs.description":
      "Hướng dẫn chi tiết về cách sử dụng script benchmark VPS của tocdovps.dev",
    "docs.toc.title": "Mục lục",
    "docs.nav.prev": "Trang trước",
    "docs.nav.next": "Trang tiếp theo",
    "docs.quickStart.title": "Bắt đầu nhanh",
    "docs.quickStart.description":
      "Chạy lệnh sau trên VPS của bạn để bắt đầu benchmark:",
    "docs.quickStart.note":
      "Script sẽ tự động tải và chạy các test benchmark. Thời gian chạy ước tính khoảng 15 phút. Bạn sẽ được hỏi về sharing preferences (local/private/shared) sau 8 giây (mặc định là private nếu không có input).",
    "docs.quickStart.whatTests": "Benchmark bao gồm:",
    "docs.quickStart.test1":
      "Thông tin hệ thống (CPU, RAM, Swap, Disk, Load, Uptime, OS, Virtualization, Provider)",
    "docs.quickStart.test2":
      "Disk I/O speed test (DD - file 1GB, 3 lượt ghi + 3 lượt đọc)",
    "docs.quickStart.test3":
      "FIO benchmark test (4k, 64k, 512k, 1M block sizes) - có thể bỏ qua với SKIP_FIO=1",
    "docs.quickStart.test4":
      "Network speed test (Speedtest by Ookla - nhiều servers trên toàn thế giới)",
    "docs.usage.title": "Ví dụ sử dụng",
    "docs.usage.basic.title": "Sử dụng cơ bản",
    "docs.usage.basic.description":
      "Chạy với cài đặt mặc định. Script sẽ hỏi về chế độ chia sẻ sau 8 giây (mặc định là private nếu không có input):",
    "docs.usage.language.title": "Chọn ngôn ngữ",
    "docs.usage.language.vi": "Chạy với giao diện tiếng Việt:",
    "docs.usage.language.en": "Chạy với giao diện tiếng Anh:",
    "docs.usage.mode.title": "Sharing Mode",
    "docs.usage.mode.intro":
      "Bạn có thể chỉ định chế độ chia sẻ qua URL parameter hoặc command line argument:",
    "docs.usage.mode.local.title": "Local Mode",
    "docs.usage.mode.local":
      "Giữ kết quả ở local only, không gửi bất kỳ dữ liệu nào lên server:",
    "docs.usage.mode.private.title": "Private Mode",
    "docs.usage.mode.private":
      "Chia sẻ với server, nhưng chỉ người có URL mới xem được kết quả:",
    "docs.usage.mode.shared.title": "Shared Mode",
    "docs.usage.mode.shared":
      "Chia sẻ công khai để mọi người có thể tìm và xem kết quả của bạn trong bảng xếp hạng:",
    "docs.usage.advanced.title": "Advanced Options",
    "docs.usage.advanced.skipFio.title": "Skip FIO Test",
    "docs.usage.advanced.skipFio.description":
      "Bỏ qua test FIO benchmark để giảm thời gian chạy. Hữu ích nếu bạn chỉ cần basic disk I/O test:",
    "docs.usage.advanced.networkOnly.title": "Network Test Only",
    "docs.usage.advanced.networkOnly.description":
      "Chỉ chạy network speed tests, bỏ qua system info, disk I/O, và FIO tests:",
    "docs.usage.advanced.customServers.title": "Custom Speedtest Servers",
    "docs.usage.advanced.customServers.description":
      "Test các Speedtest servers cụ thể bằng cách cung cấp server IDs (phân cách bằng dấu phẩy). Bạn có thể tìm server IDs tại https://www.speedtest.net/apps/cli:",
    "docs.usage.advanced.speedtestSleep.title": "Adjust Speedtest Rate Limit",
    "docs.usage.advanced.speedtestSleep.description":
      "Thay đổi thời gian ngủ giữa các Speedtest server tests (mặc định: 3 giây). Tăng giá trị này nếu bạn gặp rate limiting:",
    "docs.usage.combined.title": "Kết hợp các tham số",
    "docs.usage.combined.description":
      "Bạn có thể kết hợp nhiều tham số cùng lúc:",
    "docs.parameters.title": "Tham số",
    "docs.parameters.optional": "Tùy chọn",
    "docs.parameters.lang.description":
      "Chọn ngôn ngữ cho giao diện script. Nếu không chỉ định, script sẽ hỏi bạn.",
    "docs.parameters.lang.vi": "Tiếng Việt",
    "docs.parameters.lang.en": "English",
    "docs.parameters.mode.title": "Chế độ chia sẻ",
    "docs.parameters.mode.description":
      "Chọn cách chia sẻ kết quả. Nếu không chỉ định, script sẽ hỏi (mặc định private sau 8 giây).",
    "docs.parameters.mode.local":
      "Giữ kết quả tại máy, không gửi bất kỳ dữ liệu nào lên server",
    "docs.parameters.mode.private":
      "Chia sẻ với server, nhưng chỉ người có URL mới xem được kết quả",
    "docs.parameters.mode.shared":
      "Chia sẻ công khai và hiển thị trên leaderboard",
    "docs.parameters.mode.example": "Ví dụ: Chỉ định chế độ qua URL parameter",
    "docs.tests.title": "Script test những gì?",
    "docs.tests.system.title": "Thông tin hệ thống",
    "docs.tests.system.description":
      "Script thu thập thông tin hệ thống toàn diện:",
    "docs.tests.system.cpu": "Thông tin CPU (model, số nhân, tần số)",
    "docs.tests.system.ram": "Thông tin RAM (tổng và khả dụng)",
    "docs.tests.system.swap": "Thông tin Swap (tổng và đã sử dụng)",
    "docs.tests.system.disk": "Thông tin Disk (tổng, đã sử dụng, khả dụng)",
    "docs.tests.system.load": "Load average (1min, 5min, 15min)",
    "docs.tests.system.uptime": "Thời gian hoạt động của hệ thống",
    "docs.tests.system.os": "Hệ điều hành và phiên bản",
    "docs.tests.system.virtualization": "Loại ảo hóa (KVM, VMWARE, QEMU, etc.)",
    "docs.tests.system.provider":
      "Nhà cung cấp/datacenter (phát hiện từ IP geolocation)",
    "docs.tests.performance.title": "Hiệu năng",
    "docs.tests.performance.disk.title": "Disk I/O Test (DD)",
    "docs.tests.performance.disk.description":
      "Test tốc độ ghi và đọc tuần tự của disk bằng lệnh dd:",
    "docs.tests.performance.disk.fileSize":
      "Kích thước file: 1GB (1073741824 bytes, lớn hơn cache)",
    "docs.tests.performance.disk.rounds":
      "Số lượt: 3 lượt ghi + 3 lượt đọc (tổng 6 lượt)",
    "docs.tests.performance.disk.directIo":
      "Direct I/O: được bật (bypass cache sử dụng oflag=direct cho ghi, iflag=direct cho đọc)",
    "docs.tests.performance.disk.fallback":
      "Fallback: Nếu direct I/O thất bại, sẽ fallback về normal I/O",
    "docs.tests.performance.disk.result":
      "Kết quả: Hiển thị tốc độ từng lượt, tính trung bình từ các lượt thành công",
    "docs.tests.performance.disk.metrics":
      "Metrics: Tốc độ ghi (MB/s, Mbps), Tốc độ đọc (MB/s, Mbps), Bytes đã ghi",
    "docs.tests.performance.fio.title": "FIO Benchmark Test",
    "docs.tests.performance.fio.description":
      "Benchmark disk I/O nâng cao sử dụng FIO (Flexible I/O Tester):",
    "docs.tests.performance.fio.blockSizes": "Block sizes: 4k, 64k, 512k, 1M",
    "docs.tests.performance.fio.fileSize": "Kích thước file: 500MB mỗi test",
    "docs.tests.performance.fio.runtime":
      "Thời gian chạy: 30 giây mỗi block size",
    "docs.tests.performance.fio.iodepth": "I/O depth: 16",
    "docs.tests.performance.fio.metrics":
      "Metrics: Bandwidth (MB/s) và IOPS cho cả read và write operations",
    "docs.tests.performance.fio.ioping": "Ioping latency test (nếu có sẵn)",
    "docs.tests.performance.fio.note":
      "FIO sẽ được tự động cài đặt nếu chưa có và sudo có sẵn. Bạn có thể bỏ qua test FIO với `SKIP_FIO=1`.",
    "docs.tests.performance.network.title": "Network Speed Test",
    "docs.tests.performance.network.description":
      "Test tốc độ mạng sử dụng Speedtest by Ookla (CLI):",
    "docs.tests.performance.network.servers":
      "Servers mặc định: 12 servers trên toàn thế giới (Vietnam: VNPT Hanoi, FPT Hanoi, Viettel Ho Chi Minh; Singapore: Singtel; Hong Kong: HKIX; Japan: Tokyo Verizon; India: Kolkata TataPlay; Australia: Sydney Telstra; USA: Los Angeles Hivelocity; Brazil: Vtal; UK: London Vodafone; Germany: Berlin Deutsche Telekom)",
    "docs.tests.performance.network.customServers":
      "Custom servers: Bạn có thể chỉ định custom server IDs qua biến môi trường `SPEEDTEST_SERVER_IDS` (phân cách bằng dấu phẩy)",
    "docs.tests.performance.network.metrics":
      "Metrics: Ping (latency tính bằng ms), Tốc độ tải xuống (Mbps), Tốc độ tải lên (Mbps)",
    "docs.tests.performance.network.format":
      "Định dạng output: JSON (parse bằng Python3, với jq hoặc regex làm fallback)",
    "docs.tests.performance.network.rateLimit":
      "Rate limiting: Ngủ 3 giây giữa các servers để tránh Ookla rate limits (có thể cấu hình qua biến môi trường `SPEEDTEST_SLEEP`)",
    "docs.tests.performance.network.progress":
      "Progress indicator: Hiển thị server hiện tại đang được test và thời gian đã trôi qua",
    "docs.tests.performance.network.autoInstall":
      "Auto-install: Speedtest CLI sẽ được tự động cài đặt nếu chưa có (chỉ Debian/Ubuntu)",
    "docs.tests.performance.network.note":
      "Network test có thể chạy độc lập với tùy chọn `NETWORK_ONLY=1`.",
    "docs.faq.title": "Câu hỏi thường gặp",
    "docs.faq.q1.question": "Script có an toàn không?",
    "docs.faq.q1.answer":
      "Có, script an toàn. Script chỉ chạy các test benchmark trên máy của bạn. Script không cài đặt phần mềm hoặc thay đổi cấu hình hệ thống (trừ việc tự động cài đặt fio và speedtest nếu cần và sudo có sẵn). Bạn có thể xem mã nguồn tại GitHub trước khi chạy.",
    "docs.faq.q2.question": "Dữ liệu của tôi có được bảo mật không?",
    "docs.faq.q2.answer":
      "Có, dữ liệu của bạn được bảo mật. Bạn có thể chọn chế độ 'local' để không gửi bất kỳ dữ liệu nào lên server. Hoặc chọn chế độ 'private' để chỉ người có URL mới xem được kết quả của bạn. Chỉ khi chọn chế độ 'shared' thì kết quả mới được hiển thị công khai trong bảng xếp hạng.",
    "docs.faq.q3.question": "Script có yêu cầu quyền root không?",
    "docs.faq.q3.answer":
      "Không, script không yêu cầu quyền root để chạy. Tuy nhiên, một số thao tác (như cài đặt fio hoặc speedtest) có thể yêu cầu sudo nếu các packages đó chưa được cài đặt. Script sẽ tự động bỏ qua auto-installation nếu sudo không có sẵn.",
    "docs.faq.q4.question": "Benchmark mất bao lâu?",
    "docs.faq.q4.answer":
      "Full benchmark mất khoảng 15 phút. Điều này bao gồm thu thập system info (~1 phút), disk I/O test (~3 phút), FIO test (~8 phút cho 4 block sizes), và network speed tests (~3 phút cho nhiều servers). Bạn có thể giảm thời gian chạy bằng cách bỏ qua FIO với `SKIP_FIO=1` hoặc chỉ chạy network tests với `NETWORK_ONLY=1`.",
    "docs.faq.q5.question": "Script cài đặt những packages nào?",
    "docs.faq.q5.answer":
      "Script có thể tự động cài đặt fio (cho FIO benchmark) và speedtest (Ookla CLI cho network tests) nếu chúng chưa có và sudo có sẵn. Hỗ trợ cài đặt apt-get (Debian/Ubuntu), yum (CentOS/RHEL), dnf (Fedora), và pacman (Arch). Speedtest auto-install chỉ hoạt động trên hệ thống Debian/Ubuntu. Đối với các distribution khác, bạn có thể cần cài đặt các packages này thủ công.",
    "docs.faq.q6.question": "Tôi có thể bỏ qua một số tests không?",
    "docs.faq.q6.answer":
      "Có! Bạn có thể bỏ qua một số tests. Sử dụng `SKIP_FIO=1` để bỏ qua test FIO benchmark, hoặc `NETWORK_ONLY=1` để chỉ chạy network speed tests. Script sẽ tự động bỏ qua auto-installation của packages nếu bạn bỏ qua các tests tương ứng.",
    "docs.sidebar.quickStart": "Bắt đầu nhanh",
    "docs.sidebar.usage": "Ví dụ sử dụng",
    "docs.sidebar.parameters": "Tham số",
    "docs.sidebar.technical": "Chi tiết kỹ thuật",
    "docs.sidebar.tests": "Các test",
    "docs.sidebar.faq": "Câu hỏi thường gặp",
    "docs.technical.title": "Chi tiết kỹ thuật",
    "docs.technical.howItWorks.title": "Script hoạt động như thế nào",
    "docs.technical.howItWorks.description":
      "Script benchmark thực hiện các test toàn diện trên VPS của bạn để đo hiệu năng thực tế. Thời gian chạy ước tính khoảng 15 phút.",
    "docs.technical.howItWorks.step1":
      "Thu thập thông tin hệ thống (CPU, RAM, Swap, Disk, Load, Uptime, OS, Virtualization, Provider)",
    "docs.technical.howItWorks.step2":
      "Chạy test disk I/O bằng dd (file 1GB, 3 lượt ghi + 3 lượt đọc, direct I/O)",
    "docs.technical.howItWorks.step3":
      "Chạy FIO benchmark với nhiều block sizes (4k, 64k, 512k, 1M) - có thể bỏ qua với SKIP_FIO=1",
    "docs.technical.howItWorks.step4":
      "Chạy network speed tests sử dụng Speedtest by Ookla (nhiều servers trên toàn thế giới)",
    "docs.technical.howItWorks.step5":
      "Tùy chọn gửi kết quả lên API tại BASE_URL của bạn để chia sẻ (dựa trên mode: local/private/shared)",
    "docs.technical.ddTest.title": "DD Disk I/O Test",
    "docs.technical.ddTest.description":
      "Sử dụng lệnh dd để test tốc độ ghi và đọc tuần tự của disk. Test này cung cấp đo lường cơ bản về hiệu năng disk.",
    "docs.technical.ddTest.fileSize":
      "Kích thước file: 1GB (1073741824 bytes, lớn hơn cache thông thường)",
    "docs.technical.ddTest.rounds":
      "Số lượt: 3 lượt ghi + 3 lượt đọc (tổng 6 lượt)",
    "docs.technical.ddTest.directIo":
      "Direct I/O: được bật (bypass cache sử dụng oflag=direct cho ghi, iflag=direct cho đọc)",
    "docs.technical.ddTest.fallback":
      "Fallback: Nếu direct I/O thất bại, sẽ fallback về normal I/O (không bypass cache)",
    "docs.technical.ddTest.result":
      "Kết quả: Hiển thị tốc độ từng lượt, tính trung bình chỉ từ các lượt thành công",
    "docs.technical.ddTest.metrics":
      "Metrics: Tốc độ ghi mỗi lượt (MB/s), Trung bình ghi (MB/s, Mbps), Tốc độ đọc mỗi lượt (MB/s), Trung bình đọc (MB/s, Mbps), Bytes đã ghi",
    "docs.technical.ddTest.display":
      'Hiển thị: Hiển thị bảng "DD Information" với Round 1, Round 2, Round 3, và Average cho tốc độ ghi',
    "docs.technical.fioTest.title": "FIO Benchmark Test",
    "docs.technical.fioTest.description":
      "Sử dụng FIO (Flexible I/O Tester) để thực hiện benchmark disk I/O nâng cao. FIO cung cấp các metrics chi tiết bao gồm IOPS và bandwidth cho các block sizes khác nhau.",
    "docs.technical.fioTest.blockSizes":
      "Block sizes: 4k, 64k, 512k, 1M (tổng 4 tests, test tuần tự)",
    "docs.technical.fioTest.fileSize":
      "Kích thước file: 500MB mỗi test (lớn hơn cache để tránh cache effects)",
    "docs.technical.fioTest.runtime":
      "Thời gian chạy: 30 giây mỗi block size (test dựa trên thời gian)",
    "docs.technical.fioTest.iodepth":
      "I/O depth: 16 (các I/O operations đồng thời)",
    "docs.technical.fioTest.ioengine":
      "I/O engine: libaio (Linux asynchronous I/O)",
    "docs.technical.fioTest.directIo":
      "Direct I/O: được bật (bypass cache, direct=1)",
    "docs.technical.fioTest.progress":
      'Progress indicator: Hiển thị block size hiện tại đang được test và thời gian đã trôi qua (ví dụ: "[i] FIO 2/4: 64k (elapsed: 2m 15s)")',
    "docs.technical.fioTest.metrics":
      "Metrics: Bandwidth Tổng/Đọc/Ghi (MB/s), IOPS Tổng/Đọc/Ghi (format với suffix 'k' nếu >= 1000)",
    "docs.technical.fioTest.display":
      "Hiển thị: Kết quả được hiển thị dạng bảng với các cột: Block Size, Total, Read, Write, IOPS, IOPSRead, IOPSWrite",
    "docs.technical.fioTest.ioping":
      "Ioping latency: Được test nếu ioping có sẵn (10 requests, latency tính bằng microseconds)",
    "docs.technical.fioTest.autoInstall":
      "FIO sẽ được tự động cài đặt nếu chưa có và sudo có sẵn. Hỗ trợ cài đặt: apt-get (Debian/Ubuntu), yum (CentOS/RHEL), dnf (Fedora), pacman (Arch).",
    "docs.technical.fioTest.note":
      "FIO là tiêu chuẩn ngành cho disk I/O benchmarking. Config của chúng tôi sử dụng các thiết lập tối ưu (iodepth=16, runtime=30s, file 500MB) để đảm bảo kết quả chính xác và nhất quán. Bạn có thể bỏ qua test FIO với `SKIP_FIO=1` để giảm thời gian chạy.",
    "docs.technical.bestPractices.title": "Best Practices",
    "docs.technical.bestPractices.item1":
      "Chạy test khi system load thấp để có kết quả chính xác hơn",
    "docs.technical.bestPractices.item2":
      "Đảm bảo đủ dung lượng disk (ít nhất 2GB trống cho FIO tests)",
    "docs.technical.bestPractices.item3":
      "Tests sử dụng direct I/O để bypass cache và đo hiệu năng disk thực tế",
    "docs.technical.networkTest.title": "Network Speed Test",
    "docs.technical.networkTest.description":
      "Test tốc độ mạng sử dụng Speedtest CLI by Ookla. Test nhiều servers trên toàn thế giới để đo latency và bandwidth.",
    "docs.technical.networkTest.tool":
      "Tool: Speedtest CLI by Ookla (chính thức, yêu cầu chấp nhận license)",
    "docs.technical.networkTest.defaultServers":
      "Servers mặc định: 12 servers được test mặc định (Server IDs: 17757=Vietnam VNPT Hanoi, 2552=Vietnam FPT Hanoi, 26853=Vietnam Viettel Ho Chi Minh, 13623=Singapore Singtel, 61296=Hong Kong HKIX, 50467=Japan Tokyo Verizon, 40733=India Kolkata TataPlay, 12492=Australia Sydney Telstra, 19230=USA Los Angeles Hivelocity, 40074=Brazil Vtal, 24281=UK London Vodafone, 30907=Germany Berlin Deutsche Telekom)",
    "docs.technical.networkTest.customServers":
      'Custom servers: Chỉ định qua biến môi trường `SPEEDTEST_SERVER_IDS` (server IDs phân cách bằng dấu phẩy, ví dụ: `SPEEDTEST_SERVER_IDS="17757,2552"`)',
    "docs.technical.networkTest.metrics":
      "Metrics: Ping (latency tính bằng ms), Tốc độ tải xuống (Mbps), Tốc độ tải lên (Mbps)",
    "docs.technical.networkTest.format":
      "Định dạng output: JSON (parse với Python3/jq/regex fallback)",
    "docs.technical.networkTest.rateLimit":
      "Rate limiting: Ngủ 3 giây giữa các servers (có thể cấu hình qua biến môi trường `SPEEDTEST_SLEEP`, mặc định: 3)",
    "docs.technical.networkTest.progress":
      'Progress indicator: Hiển thị server hiện tại đang được test (ví dụ: "[3/12] Testing: VN HN FPT (elapsed: 1m 30s)")',
    "docs.technical.networkTest.errorHandling":
      "Error handling: Các servers thất bại được tự động bỏ qua, và script tiếp tục với các servers còn lại",
    "docs.technical.networkTest.autoInstall":
      "Speedtest CLI sẽ được tự động cài đặt nếu chưa có (chỉ Debian/Ubuntu). Đối với các distribution khác, vui lòng cài đặt thủ công từ https://www.speedtest.net/apps/cli",
    "docs.technical.networkTest.networkOnly":
      "Bạn có thể chỉ chạy network tests với tùy chọn `NETWORK_ONLY=1`, điều này sẽ bỏ qua tất cả các tests khác.",
    "docs.technical.bestPractices.item4":
      "Kết quả có thể thay đổi nhẹ giữa các lần chạy do system load và trạng thái disk",
    "docs.technical.bestPractices.item5":
      "Network tests có thể mất nhiều thời gian hơn nếu test nhiều servers (mặc định: ~12 servers)",
    "docs.technical.bestPractices.item6":
      "FIO test có thể bỏ qua với `SKIP_FIO=1` nếu bạn chỉ cần basic disk I/O test",
    "docs.technical.bestPractices.item7":
      "Sử dụng `NETWORK_ONLY=1` để kiểm tra tốc độ mạng nhanh mà không chạy các tests khác",
  },
  en: {
    "header.brand": "tocdovps.dev",
    "header.nav.about": "Home",
    "header.nav.howItWorks": "How it works",
    "header.nav.leaderboard": "Leaderboard",
    "header.locale.vi": "VI",
    "header.locale.en": "EN",
    "hero.title": "Transparent VPS performance benchmarking",
    "hero.subtitle":
      "tocdovps.dev is a personal project to reveal the real-world performance of VPS plans – latency, network throughput, disk I/O – presented in a clear and honest way. Start benchmarking your VPS with tocdovps.dev.",
    "hero.ctaPrimary": "Explore benchmarks (Coming soon)",
    "hero.ctaSecondary": "Documentation",
    "hero.ctaPrimaryNote": "Start benchmarking your VPS with tocdovps.dev.",
    "hero.scriptLabel": "Run benchmark on your VPS",
    "hero.copyButton": "Copy script",
    "hero.copiedButton": "Copied",
    "hero.benchmarkCount": "Total benchmarks: {count}",
    "features.title": "Features",
    "features.landingPage.title": "Landing page",
    "features.landingPage.description":
      "Homepage introducing the project and usage guide.",
    "features.leaderboard.title": "Benchmark results leaderboard",
    "features.leaderboard.description":
      "View detailed benchmark results with sorting and pagination.",
    "features.auth.title": "User authentication",
    "features.auth.description":
      "Sign in with credentials, Google, GitHub (coming soon).",
    "features.customScript.title": "Customizable script",
    "features.customScript.description":
      "Multiple speedtest and hardware options (coming soon).",
    "features.notifications.title": "Automatic notifications",
    "features.notifications.description":
      "Send results to Telegram, Discord, Email (coming soon).",
    "features.compare.title": "VPS comparison",
    "features.compare.description":
      "Compare performance between different VPS (coming soon).",
    "features.badge.available": "Available",
    "features.badge.comingSoon": "Coming soon",
    "banner.howItWorks.title": "How it works",
    "banner.howItWorks.step1.title": "Step 1 – Collect information",
    "banner.howItWorks.step1.body":
      "Select the VPS plan, provider, and test region.",
    "banner.howItWorks.step2.title": "Step 2 – Run the tests",
    "banner.howItWorks.step2.body":
      "Run latency, network throughput, and disk I/O tests on real environments.",
    "banner.howItWorks.step3.title": "Step 3 – Aggregate & rank",
    "banner.howItWorks.step3.body":
      "Normalize results, compute an overall score, and display them in an easy-to-read leaderboard.",
    "banner.demo.title": "Leaderboard demo (sample data)",
    "banner.demo.note":
      "This is demo data for the UI only, not real benchmark results yet.",
    "footer.note":
      "Personal project, real benchmarking features are under active development.",
    "footer.links.title": "Links",
    "footer.links.home": "Home",
    "footer.links.leaderboard": "Leaderboard",
    "footer.links.howItWorks": "How it works",
    "footer.social.title": "Connect",
    "footer.social.website": "hophamlam.com",
    "footer.copyright": "© {year} tocdovps.dev",
    "footer.copyright.builtBy": "Built by",
    "footer.copyright.sourceCode": "Source code available at",
    "latestBenchmarks.title": "Latest benchmarks",
    "latestBenchmarks.description":
      "A few of the most recent runs reported by the CLI script.",
    "latestBenchmarks.table.time": "Time (UTC)",
    "latestBenchmarks.table.label": "Label",
    "latestBenchmarks.table.ping": "Avg ping (ms)",
    "latestBenchmarks.table.download": "Download (Mbps)",
    "latestBenchmarks.table.score": "Score",
    "latestBenchmarks.empty": "No benchmark results yet.",
    "latestBenchmarks.emptyDescription":
      "Run the benchmark script on your VPS to see results here.",
    "stats.subtitle":
      "Quick overview from benchmark runs that have been submitted.",
    "stats.totalRuns": "Total benchmark runs",
    "stats.avgScore": "Average score",
    "stats.avgDownload": "Average download speed",
    "leaderboard.title": "Leaderboard",
    "leaderboard.description":
      "View benchmark results sorted by score, download speed, ping, or date.",
    "leaderboard.sortBy": "Sort by",
    "leaderboard.sort.score": "Score",
    "leaderboard.sort.download": "Download",
    "leaderboard.sort.ping": "Ping",
    "leaderboard.sort.date": "Date",
    "leaderboard.table.time": "Time",
    "leaderboard.table.label": "Label",
    "leaderboard.table.ping": "Ping (ms)",
    "leaderboard.table.download": "Download (Mbps)",
    "leaderboard.table.score": "Score",
    "leaderboard.empty": "No benchmark results yet.",
    "leaderboard.emptyDescription":
      "Run the benchmark script on your VPS to see results here.",
    "leaderboard.pagination.showing": "Showing {start}-{end} of {total}",
    "leaderboard.pagination.previous": "Previous",
    "leaderboard.pagination.next": "Next",
    "result.title": "Benchmark Result Details",
    "result.description":
      "View detailed information and raw data for this benchmark run.",
    "result.backToLeaderboard": "Back to leaderboard",
    "result.summary.title": "Summary",
    "result.summary.time": "Time",
    "result.summary.serverLabel": "Server Label",
    "result.summary.avgPing": "Average Ping",
    "result.summary.downloadSpeed": "Download Speed",
    "result.summary.score": "Score",
    "result.summary.sourceIp": "Source IP",
    "result.rawPayload.title": "Raw Payload",
    "result.rawPayload.description":
      "Complete JSON data sent from the benchmark script.",
    "error.notFound.title": "Page Not Found",
    "error.notFound.description":
      "The page you're looking for doesn't exist or has been removed.",
    "error.notFound.backHome": "Back to Home",
    "error.notFound.viewLeaderboard": "View Leaderboard",
    "error.generic.title": "Something went wrong",
    "error.generic.description":
      "Sorry, an error occurred. Please try again later.",
    "error.generic.retry": "Try Again",
    "error.generic.backHome": "Back to Home",
    "header.nav.docs": "Docs",
    "docs.title": "Documentation",
    "docs.description":
      "Complete guide on how to use tocdovps.dev VPS benchmark script",
    "docs.toc.title": "Table of Contents",
    "docs.nav.prev": "Previous",
    "docs.nav.next": "Next",
    "docs.quickStart.title": "Quick Start",
    "docs.quickStart.description":
      "Run the following command on your VPS to start benchmarking:",
    "docs.quickStart.note":
      "The script will automatically download and run benchmark tests. Estimated runtime is approximately 15 minutes. You will be prompted for sharing preferences (local/private/shared) after 8 seconds (defaults to private if no input).",
    "docs.quickStart.whatTests": "The benchmark includes:",
    "docs.quickStart.test1":
      "System information (CPU, RAM, Swap, Disk, Load, Uptime, OS, Virtualization, Provider)",
    "docs.quickStart.test2":
      "Disk I/O speed test (DD - 1GB file, 3 write rounds + 3 read rounds)",
    "docs.quickStart.test3":
      "FIO benchmark test (4k, 64k, 512k, 1M block sizes) - can be skipped with SKIP_FIO=1",
    "docs.quickStart.test4":
      "Network speed test (Speedtest by Ookla - multiple servers worldwide)",
    "docs.usage.title": "Usage Examples",
    "docs.usage.basic.title": "Basic Usage",
    "docs.usage.basic.description":
      "Run with default settings. The script will prompt for sharing mode after 8 seconds (defaults to private if no input):",
    "docs.usage.language.title": "Language Selection",
    "docs.usage.language.vi": "Run with Vietnamese interface:",
    "docs.usage.language.en": "Run with English interface:",
    "docs.usage.mode.title": "Sharing Mode",
    "docs.usage.mode.intro":
      "You can specify the sharing mode via URL parameter or command line argument:",
    "docs.usage.mode.local.title": "Local Mode",
    "docs.usage.mode.local":
      "Keep results local only, do not send any data to the server:",
    "docs.usage.mode.private.title": "Private Mode",
    "docs.usage.mode.private":
      "Share with the server, but only people with the URL can view the results:",
    "docs.usage.mode.shared.title": "Shared Mode",
    "docs.usage.mode.shared":
      "Share publicly so everyone can find and view your results in the leaderboard:",
    "docs.usage.advanced.title": "Advanced Options",
    "docs.usage.advanced.skipFio.title": "Skip FIO Test",
    "docs.usage.advanced.skipFio.description":
      "Skip the FIO benchmark test to reduce runtime. Useful if you only need the basic disk I/O test:",
    "docs.usage.advanced.networkOnly.title": "Network Test Only",
    "docs.usage.advanced.networkOnly.description":
      "Run only network speed tests, skipping system info, disk I/O, and FIO tests:",
    "docs.usage.advanced.customServers.title": "Custom Speedtest Servers",
    "docs.usage.advanced.customServers.description":
      "Test specific Speedtest servers by providing server IDs (comma-separated). You can find server IDs at https://www.speedtest.net/apps/cli:",
    "docs.usage.advanced.speedtestSleep.title": "Adjust Speedtest Rate Limit",
    "docs.usage.advanced.speedtestSleep.description":
      "Change the sleep time between Speedtest server tests (default: 3 seconds). Increase this value if you encounter rate limiting:",
    "docs.usage.combined.title": "Combining Parameters",
    "docs.usage.combined.description":
      "You can combine multiple parameters at once:",
    "docs.parameters.title": "Parameters",
    "docs.parameters.optional": "Optional",
    "docs.parameters.environment.title": "Biến môi trường",
    "docs.parameters.environment.skipFio.title": "SKIP_FIO",
    "docs.parameters.environment.skipFio.description":
      "Bỏ qua test FIO. Đặt `1` để bỏ, `0` hoặc bỏ trống để chạy (mặc định: chạy).",
    "docs.parameters.environment.networkOnly.title": "NETWORK_ONLY",
    "docs.parameters.environment.networkOnly.description":
      "Chỉ chạy các bài test mạng. Đặt `1` để bật, `0` hoặc bỏ trống để chạy full benchmark (mặc định: full).",
    "docs.parameters.environment.reportUrl.title": "REPORT_URL",
    "docs.parameters.environment.reportUrl.description":
      "Ghi đè API endpoint mặc định. Hữu ích cho môi trường dev/test.",
    "docs.parameters.environment.speedtestServers.title":
      "SPEEDTEST_SERVER_IDS",
    "docs.parameters.environment.speedtestServers.description":
      "Specify custom Speedtest server IDs to test (comma-separated). Default: 12 servers worldwide (17757,2552,26853,13623,61296,50467,40733,12492,19230,40074,24281,30907). You can find server IDs at https://www.speedtest.net/apps/cli",
    "docs.parameters.environment.speedtestSleep.title": "SPEEDTEST_SLEEP",
    "docs.parameters.environment.speedtestSleep.description":
      "Sleep time (in seconds) between Speedtest server tests to avoid rate limiting. Default: 3 seconds. Increase this value if you encounter rate limiting issues.",
    "docs.parameters.lang.description":
      "Choose language for script interface. If not specified, script will ask you.",
    "docs.parameters.lang.vi": "Vietnamese",
    "docs.parameters.lang.en": "English",
    "docs.parameters.mode.title": "Sharing Mode",
    "docs.parameters.mode.description":
      "Choose how to share your results. If not specified, the script will prompt you (defaults to private after 8 seconds).",
    "docs.parameters.mode.local":
      "Keep results local only, do not send any data to the server",
    "docs.parameters.mode.private":
      "Share with the server, but only people with the URL can view the results",
    "docs.parameters.mode.shared":
      "Share publicly so everyone can find and view your results in the leaderboard",
    "docs.parameters.mode.example":
      "Example: Specify the mode via URL parameter",
    "docs.tests.title": "What does the script test?",
    "docs.tests.system.title": "System Information",
    "docs.tests.system.description":
      "The script collects comprehensive system information:",
    "docs.tests.system.cpu": "CPU information (model, cores, frequency)",
    "docs.tests.system.ram": "RAM information (total and available)",
    "docs.tests.system.swap": "Swap information (total and used)",
    "docs.tests.system.disk": "Disk information (total, used, available)",
    "docs.tests.system.load": "Load average (1min, 5min, 15min)",
    "docs.tests.system.uptime": "System uptime",
    "docs.tests.system.os": "Operating system and version",
    "docs.tests.system.virtualization":
      "Virtualization type (KVM, VMWARE, QEMU, etc.)",
    "docs.tests.system.provider":
      "Provider/datacenter (detected from IP geolocation)",
    "docs.tests.performance.title": "Performance Tests",
    "docs.tests.performance.disk.title": "Disk I/O Test (DD)",
    "docs.tests.performance.disk.description":
      "Sequential disk write and read speed test using dd command:",
    "docs.tests.performance.disk.fileSize":
      "File size: 1GB (1073741824 bytes, larger than cache)",
    "docs.tests.performance.disk.rounds":
      "Rounds: 3 write rounds + 3 read rounds (total 6 rounds)",
    "docs.tests.performance.disk.directIo":
      "Direct I/O: enabled (bypasses cache using oflag=direct for writes, iflag=direct for reads)",
    "docs.tests.performance.disk.fallback":
      "Fallback: If direct I/O fails, falls back to normal I/O",
    "docs.tests.performance.disk.result":
      "Results: Individual round speeds are displayed, with average calculated from successful rounds only",
    "docs.tests.performance.disk.metrics":
      "Metrics: Write speed (MB/s, Mbps), Read speed (MB/s, Mbps), Bytes written",
    "docs.tests.performance.fio.title": "FIO Benchmark Test",
    "docs.tests.performance.fio.description":
      "Advanced disk I/O benchmark using FIO (Flexible I/O Tester):",
    "docs.tests.performance.fio.blockSizes": "Block sizes: 4k, 64k, 512k, 1M",
    "docs.tests.performance.fio.fileSize": "File size: 500MB per test",
    "docs.tests.performance.fio.runtime": "Runtime: 30 seconds per block size",
    "docs.tests.performance.fio.iodepth": "I/O depth: 16",
    "docs.tests.performance.fio.metrics":
      "Metrics: Bandwidth (MB/s) and IOPS for both read and write operations",
    "docs.tests.performance.fio.ioping": "Ioping latency test (if available)",
    "docs.tests.performance.fio.note":
      "FIO will be automatically installed if not available and sudo is present. You can skip FIO test with `SKIP_FIO=1`.",
    "docs.tests.performance.network.title": "Network Speed Test",
    "docs.tests.performance.network.description":
      "Network speed test using Speedtest by Ookla (CLI):",
    "docs.tests.performance.network.servers":
      "Default servers: 12 servers worldwide (Vietnam: VNPT Hanoi, FPT Hanoi, Viettel Ho Chi Minh; Singapore: Singtel; Hong Kong: HKIX; Japan: Tokyo Verizon; India: Kolkata TataPlay; Australia: Sydney Telstra; USA: Los Angeles Hivelocity; Brazil: Vtal; UK: London Vodafone; Germany: Berlin Deutsche Telekom)",
    "docs.tests.performance.network.customServers":
      "Custom servers: You can specify custom server IDs via `SPEEDTEST_SERVER_IDS` environment variable (comma-separated)",
    "docs.tests.performance.network.metrics":
      "Metrics: Ping (latency in ms), Download speed (Mbps), Upload speed (Mbps)",
    "docs.tests.performance.network.format":
      "Output format: JSON (parsed using Python3, with jq or regex as fallback)",
    "docs.tests.performance.network.rateLimit":
      "Rate limiting: 3 seconds sleep between servers to avoid Ookla rate limits (configurable via `SPEEDTEST_SLEEP` environment variable)",
    "docs.tests.performance.network.progress":
      "Progress indicator: Shows current server being tested and elapsed time",
    "docs.tests.performance.network.autoInstall":
      "Auto-install: Speedtest CLI will be installed automatically if not available (Debian/Ubuntu only)",
    "docs.tests.performance.network.note":
      "Network test can be run independently with `NETWORK_ONLY=1` option.",
    "docs.faq.title": "Frequently Asked Questions",
    "docs.faq.q1.question": "Is the script safe?",
    "docs.faq.q1.answer":
      "Yes, the script is safe. It only runs benchmark tests on your machine. It does not install software or modify system configuration (except auto-installing fio and speedtest if needed and sudo is available). You can view the source code on GitHub before running.",
    "docs.faq.q2.question": "Is my data secure?",
    "docs.faq.q2.answer":
      "Yes, your data is secure. You can choose 'local' mode to not send any data to the server. Or choose 'private' mode so only people with the URL can view your results. Only when choosing 'shared' mode will results be displayed publicly in the leaderboard.",
    "docs.faq.q3.question": "Does the script require root?",
    "docs.faq.q3.answer":
      "No, the script does not require root privileges to run. However, some operations (like installing fio or speedtest) may require sudo if those packages are not already installed. The script will automatically skip auto-installation if sudo is not available.",
    "docs.faq.q4.question": "How long does the benchmark take?",
    "docs.faq.q4.answer":
      "The full benchmark takes approximately 15 minutes. This includes system info collection (~1 minute), disk I/O test (~3 minutes), FIO test (~8 minutes for 4 block sizes), and network speed tests (~3 minutes for multiple servers). You can reduce runtime by skipping FIO with `SKIP_FIO=1` or run only network tests with `NETWORK_ONLY=1`.",
    "docs.faq.q5.question": "What packages does the script install?",
    "docs.faq.q5.answer":
      "The script may auto-install fio (for FIO benchmark) and speedtest (Ookla CLI for network tests) if they are not available and sudo is present. Installation supports apt-get (Debian/Ubuntu), yum (CentOS/RHEL), dnf (Fedora), and pacman (Arch). Speedtest auto-install only works on Debian/Ubuntu systems. For other distributions, you may need to install these packages manually.",
    "docs.faq.q6.question": "Can I skip certain tests?",
    "docs.faq.q6.answer":
      "Yes! You can skip certain tests. Use `SKIP_FIO=1` to skip the FIO benchmark test, or `NETWORK_ONLY=1` to run only network speed tests. The script will automatically skip auto-installation of packages if you skip the corresponding tests.",
    "docs.sidebar.quickStart": "Quick Start",
    "docs.sidebar.usage": "Usage Examples",
    "docs.sidebar.parameters": "Parameters",
    "docs.sidebar.technical": "Technical Details",
    "docs.sidebar.tests": "What it Tests",
    "docs.sidebar.faq": "FAQ",
    "docs.technical.title": "Technical Details",
    "docs.technical.howItWorks.title": "How the Script Works",
    "docs.technical.howItWorks.description":
      "The benchmark script performs comprehensive tests on your VPS to measure real-world performance. Estimated runtime is approximately 15 minutes.",
    "docs.technical.howItWorks.step1":
      "Collects system information (CPU, RAM, Swap, Disk, Load, Uptime, OS, Virtualization, Provider)",
    "docs.technical.howItWorks.step2":
      "Runs disk I/O tests using dd (1GB file, 3 write rounds + 3 read rounds, direct I/O)",
    "docs.technical.howItWorks.step3":
      "Runs FIO benchmark with multiple block sizes (4k, 64k, 512k, 1M) - can be skipped with SKIP_FIO=1",
    "docs.technical.howItWorks.step4":
      "Runs network speed tests using Speedtest by Ookla (multiple servers worldwide)",
    "docs.technical.howItWorks.step5":
      "Optionally sends results to your BASE_URL API for sharing (based on mode: local/private/shared)",
    "docs.technical.ddTest.title": "DD Disk I/O Test",
    "docs.technical.ddTest.description":
      "Uses dd command to test sequential disk write and read speeds. This test provides a baseline measurement of disk performance.",
    "docs.technical.ddTest.fileSize":
      "File size: 1GB (1073741824 bytes, larger than typical cache)",
    "docs.technical.ddTest.rounds":
      "Rounds: 3 write rounds + 3 read rounds (total 6 rounds)",
    "docs.technical.ddTest.directIo":
      "Direct I/O: enabled (bypasses cache using oflag=direct for writes, iflag=direct for reads)",
    "docs.technical.ddTest.fallback":
      "Fallback: If direct I/O fails, falls back to normal I/O (without cache bypass)",
    "docs.technical.ddTest.result":
      "Results: Individual round speeds are displayed, with average calculated from successful rounds only",
    "docs.technical.ddTest.metrics":
      "Metrics: Write speed per round (MB/s), Write average (MB/s, Mbps), Read speed per round (MB/s), Read average (MB/s, Mbps), Bytes written",
    "docs.technical.ddTest.display":
      'Display: Shows a "DD Information" table with Round 1, Round 2, Round 3, and Average for write speeds',
    "docs.technical.fioTest.title": "FIO Benchmark Test",
    "docs.technical.fioTest.description":
      "Uses FIO (Flexible I/O Tester) to perform advanced disk I/O benchmarks. FIO provides detailed metrics including IOPS and bandwidth for different block sizes.",
    "docs.technical.fioTest.blockSizes":
      "Block sizes: 4k, 64k, 512k, 1M (4 tests total, tested sequentially)",
    "docs.technical.fioTest.fileSize":
      "File size: 500MB per test (larger than cache to avoid cache effects)",
    "docs.technical.fioTest.runtime":
      "Runtime: 30 seconds per block size (time-based test)",
    "docs.technical.fioTest.iodepth":
      "I/O depth: 16 (concurrent I/O operations)",
    "docs.technical.fioTest.ioengine":
      "I/O engine: libaio (Linux asynchronous I/O)",
    "docs.technical.fioTest.directIo":
      "Direct I/O: enabled (bypass cache, direct=1)",
    "docs.technical.fioTest.progress":
      'Progress indicator: Shows current block size being tested and elapsed time (example: "[i] FIO 2/4: 64k (elapsed: 2m 15s)")',
    "docs.technical.fioTest.metrics":
      "Metrics: Total/Read/Write bandwidth (MB/s), Total/Read/Write IOPS (formatted with 'k' suffix if >= 1000)",
    "docs.technical.fioTest.display":
      "Display: Results are shown in table format with columns: Block Size, Total, Read, Write, IOPS, IOPSRead, IOPSWrite",
    "docs.technical.fioTest.ioping":
      "Ioping latency: Tested if ioping is available (10 requests, latency in microseconds)",
    "docs.technical.fioTest.autoInstall":
      "FIO will be automatically installed if not available and sudo is present. Installation supports: apt-get (Debian/Ubuntu), yum (CentOS/RHEL), dnf (Fedora), pacman (Arch).",
    "docs.technical.fioTest.note":
      "FIO is the industry standard for disk I/O benchmarking. Our configuration uses optimal settings (iodepth=16, runtime=30s, 500MB file) to ensure accurate and consistent results. You can skip FIO test with `SKIP_FIO=1` to reduce runtime.",
    "docs.technical.bestPractices.title": "Best Practices",
    "docs.technical.bestPractices.item1":
      "Run tests when system load is low for more accurate results",
    "docs.technical.bestPractices.item2":
      "Ensure sufficient disk space (at least 2GB free for FIO tests)",
    "docs.technical.bestPractices.item3":
      "Tests use direct I/O to bypass cache and measure real disk performance",
    "docs.technical.networkTest.title": "Network Speed Test",
    "docs.technical.networkTest.description":
      "Network speed test using Speedtest CLI by Ookla. Tests multiple servers worldwide to measure latency and bandwidth.",
    "docs.technical.networkTest.tool":
      "Tool: Speedtest CLI by Ookla (official, requires license acceptance)",
    "docs.technical.networkTest.defaultServers":
      "Default servers: 12 servers tested by default (Server IDs: 17757=Vietnam VNPT Hanoi, 2552=Vietnam FPT Hanoi, 26853=Vietnam Viettel Ho Chi Minh, 13623=Singapore Singtel, 61296=Hong Kong HKIX, 50467=Japan Tokyo Verizon, 40733=India Kolkata TataPlay, 12492=Australia Sydney Telstra, 19230=USA Los Angeles Hivelocity, 40074=Brazil Vtal, 24281=UK London Vodafone, 30907=Germany Berlin Deutsche Telekom)",
    "docs.technical.networkTest.customServers":
      'Custom servers: Specify via `SPEEDTEST_SERVER_IDS` environment variable (comma-separated server IDs, e.g., `SPEEDTEST_SERVER_IDS="17757,2552"`)',
    "docs.technical.networkTest.metrics":
      "Metrics: Ping (latency in ms), Download speed (Mbps), Upload speed (Mbps)",
    "docs.technical.networkTest.format":
      "Output format: JSON (parsed with Python3/jq/regex fallback)",
    "docs.technical.networkTest.rateLimit":
      "Rate limiting: 3 seconds sleep between servers (configurable via `SPEEDTEST_SLEEP` environment variable, default: 3)",
    "docs.technical.networkTest.progress":
      'Progress indicator: Shows current server being tested (example: "[3/12] Testing: VN HN FPT (elapsed: 1m 30s)")',
    "docs.technical.networkTest.errorHandling":
      "Error handling: Failed servers are skipped automatically, and the script continues with remaining servers",
    "docs.technical.networkTest.autoInstall":
      "Speedtest CLI will be automatically installed if not available (Debian/Ubuntu only). For other distributions, please install manually from https://www.speedtest.net/apps/cli",
    "docs.technical.networkTest.networkOnly":
      "You can run only network tests with `NETWORK_ONLY=1` option, which skips all other tests.",
    "docs.technical.bestPractices.item4":
      "Results may vary slightly between runs due to system load and disk state",
    "docs.technical.bestPractices.item5":
      "Network tests may take longer if many servers are tested (default: ~12 servers)",
    "docs.technical.bestPractices.item6":
      "FIO test can be skipped with `SKIP_FIO=1` if you only need basic disk I/O test",
    "docs.technical.bestPractices.item7":
      "Use `NETWORK_ONLY=1` for quick network speed check without running other tests",
  },
} as const satisfies Record<Locale, Record<string, string>>;
