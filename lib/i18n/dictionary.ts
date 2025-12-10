import type { Locale } from "./config";

export const translations = {
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
    "docs.quickStart.title": "Bắt đầu nhanh",
    "docs.quickStart.description":
      "Chạy lệnh sau trên VPS của bạn để bắt đầu benchmark:",
    "docs.quickStart.note":
      "Script sẽ tự động tải và chạy các test benchmark. Bạn sẽ được hỏi về ngôn ngữ và cách chia sẻ kết quả.",
    "docs.usage.title": "Ví dụ sử dụng",
    "docs.usage.basic.title": "Sử dụng cơ bản",
    "docs.usage.basic.description":
      "Chạy với prompt mặc định (sẽ hỏi ngôn ngữ và chế độ chia sẻ):",
    "docs.usage.language.title": "Chọn ngôn ngữ",
    "docs.usage.language.vi": "Chạy với giao diện tiếng Việt:",
    "docs.usage.language.en": "Chạy với giao diện tiếng Anh:",
    "docs.usage.mode.title": "Chọn chế độ chia sẻ",
    "docs.usage.mode.local":
      "Giữ kết quả ở local, không gửi dữ liệu lên server:",
    "docs.usage.mode.private":
      "Chia sẻ với server nhưng chỉ người có URL mới xem được:",
    "docs.usage.mode.shared":
      "Chia sẻ công khai, mọi người có thể tìm thấy trong bảng xếp hạng:",
    "docs.usage.combined.title": "Kết hợp các tham số",
    "docs.usage.combined.description":
      "Bạn có thể kết hợp nhiều tham số cùng lúc:",
    "docs.parameters.title": "Tham số",
    "docs.parameters.optional": "Tùy chọn",
    "docs.parameters.lang.description":
      "Chọn ngôn ngữ cho giao diện script. Nếu không chỉ định, script sẽ hỏi bạn.",
    "docs.parameters.lang.vi": "Tiếng Việt",
    "docs.parameters.lang.en": "English",
    "docs.parameters.mode.description":
      "Chọn cách chia sẻ kết quả. Nếu không chỉ định, script sẽ hỏi bạn.",
    "docs.parameters.mode.local": "Giữ kết quả ở local, không gửi dữ liệu",
    "docs.parameters.mode.private":
      "Chia sẻ với server, chỉ người có URL mới xem được",
    "docs.parameters.mode.shared":
      "Chia sẻ công khai, hiển thị trong bảng xếp hạng",
    "docs.tests.title": "Script test những gì?",
    "docs.tests.system.title": "Thông tin hệ thống",
    "docs.tests.system.cpu": "Thông tin CPU (model, số nhân, tần số)",
    "docs.tests.system.ram": "Thông tin RAM (tổng và khả dụng)",
    "docs.tests.system.os": "Hệ điều hành và phiên bản",
    "docs.tests.system.virtualization": "Loại ảo hóa (KVM, VMWARE, etc.)",
    "docs.tests.performance.title": "Hiệu năng",
    "docs.tests.performance.disk": "Disk I/O test (dd - 1GB file, 3 rounds)",
    "docs.tests.performance.fio":
      "FIO benchmark (4k, 64k, 512k, 1M block sizes)",
    "docs.tests.performance.ioping": "Ioping latency test (optional)",
    "docs.faq.title": "Câu hỏi thường gặp",
    "docs.faq.q1.question": "Script có an toàn không?",
    "docs.faq.q1.answer":
      "Script chỉ chạy các test benchmark trên máy của bạn. Không cài đặt phần mềm, không thay đổi cấu hình hệ thống. Bạn có thể xem mã nguồn tại GitHub trước khi chạy.",
    "docs.faq.q2.question": "Dữ liệu của tôi có được bảo mật không?",
    "docs.faq.q2.answer":
      "Bạn có thể chọn chế độ 'local' để không gửi dữ liệu lên server. Hoặc chọn 'private' để chỉ người có URL mới xem được. Chỉ khi chọn 'shared' thì kết quả mới hiển thị công khai.",
    "docs.faq.q3.question": "Script có yêu cầu quyền root không?",
    "docs.faq.q3.answer":
      "Không, script không yêu cầu quyền root. Tuy nhiên, một số test có thể cần quyền nhất định (ví dụ: ping test).",
    "docs.sidebar.quickStart": "Bắt đầu nhanh",
    "docs.sidebar.usage": "Ví dụ sử dụng",
    "docs.sidebar.parameters": "Tham số",
    "docs.sidebar.technical": "Chi tiết kỹ thuật",
    "docs.sidebar.tests": "Các test",
    "docs.sidebar.faq": "Câu hỏi thường gặp",
    "docs.technical.title": "Chi tiết kỹ thuật",
    "docs.technical.howItWorks.title": "Script hoạt động như thế nào",
    "docs.technical.howItWorks.description":
      "Script benchmark thực hiện các test toàn diện trên VPS của bạn để đo hiệu năng thực tế:",
    "docs.technical.howItWorks.step1":
      "Thu thập thông tin hệ thống (CPU, RAM, OS, virtualization)",
    "docs.technical.howItWorks.step2":
      "Chạy test disk I/O bằng dd (file 1GB, 3 rounds, direct I/O)",
    "docs.technical.howItWorks.step3":
      "Chạy FIO benchmark với nhiều block sizes (4k, 64k, 512k, 1M)",
    "docs.technical.howItWorks.step4":
      "Tùy chọn gửi kết quả lên API tocdovps.dev để chia sẻ",
    "docs.technical.ddTest.title": "DD Disk I/O Test",
    "docs.technical.ddTest.description":
      "Sử dụng lệnh dd để test tốc độ ghi và đọc tuần tự của disk. Test này cung cấp đo lường cơ bản về hiệu năng disk.",
    "docs.technical.fioTest.title": "FIO Benchmark Test",
    "docs.technical.fioTest.description":
      "Sử dụng FIO (Flexible I/O Tester) để thực hiện benchmark disk I/O nâng cao. FIO cung cấp các metrics chi tiết bao gồm IOPS và bandwidth cho các block sizes khác nhau.",
    "docs.technical.fioTest.note":
      "FIO là tiêu chuẩn ngành cho disk I/O benchmarking. Config của chúng tôi sử dụng các thiết lập tối ưu (iodepth=16, runtime=30s, file 500MB) để đảm bảo kết quả chính xác và nhất quán.",
    "docs.technical.bestPractices.title": "Best Practices",
    "docs.technical.bestPractices.item1":
      "Chạy test khi system load thấp để có kết quả chính xác hơn",
    "docs.technical.bestPractices.item2":
      "Đảm bảo đủ dung lượng disk (ít nhất 2GB trống cho FIO tests)",
    "docs.technical.bestPractices.item3":
      "Tests sử dụng direct I/O để bypass cache và đo hiệu năng disk thực tế",
    "docs.technical.bestPractices.item4":
      "Kết quả có thể thay đổi nhẹ giữa các lần chạy do system load và trạng thái disk",
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
    "docs.quickStart.title": "Quick Start",
    "docs.quickStart.description":
      "Run the following command on your VPS to start benchmarking:",
    "docs.quickStart.note":
      "The script will automatically download and run benchmark tests. You'll be prompted for language and sharing preferences.",
    "docs.usage.title": "Usage Examples",
    "docs.usage.basic.title": "Basic Usage",
    "docs.usage.basic.description":
      "Run with default prompts (will ask for language and sharing mode):",
    "docs.usage.language.title": "Language Selection",
    "docs.usage.language.vi": "Run with Vietnamese interface:",
    "docs.usage.language.en": "Run with English interface:",
    "docs.usage.mode.title": "Sharing Mode",
    "docs.usage.mode.local": "Keep result local, don't send data to server:",
    "docs.usage.mode.private":
      "Share with server but only people with URL can view:",
    "docs.usage.mode.shared":
      "Share publicly, everyone can find it in leaderboard:",
    "docs.usage.combined.title": "Combining Parameters",
    "docs.usage.combined.description":
      "You can combine multiple parameters at once:",
    "docs.parameters.title": "Parameters",
    "docs.parameters.optional": "Optional",
    "docs.parameters.lang.description":
      "Choose language for script interface. If not specified, script will ask you.",
    "docs.parameters.lang.vi": "Vietnamese",
    "docs.parameters.lang.en": "English",
    "docs.parameters.mode.description":
      "Choose how to share results. If not specified, script will ask you.",
    "docs.parameters.mode.local": "Keep result local, don't send data",
    "docs.parameters.mode.private":
      "Share with server, only people with URL can view",
    "docs.parameters.mode.shared": "Share publicly, display in leaderboard",
    "docs.tests.title": "What does the script test?",
    "docs.tests.system.title": "System Information",
    "docs.tests.system.cpu": "CPU information (model, cores, frequency)",
    "docs.tests.system.ram": "RAM information (total and available)",
    "docs.tests.system.os": "Operating system and version",
    "docs.tests.system.virtualization":
      "Virtualization type (KVM, VMWARE, etc.)",
    "docs.tests.performance.title": "Performance",
    "docs.tests.performance.disk": "Disk I/O test (dd - 1GB file, 3 rounds)",
    "docs.tests.performance.fio":
      "FIO benchmark (4k, 64k, 512k, 1M block sizes)",
    "docs.tests.performance.ioping": "Ioping latency test (optional)",
    "docs.faq.title": "Frequently Asked Questions",
    "docs.faq.q1.question": "Is the script safe?",
    "docs.faq.q1.answer":
      "The script only runs benchmark tests on your machine. It doesn't install software or modify system configuration. You can view the source code on GitHub before running.",
    "docs.faq.q2.question": "Is my data secure?",
    "docs.faq.q2.answer":
      "You can choose 'local' mode to not send data to server. Or choose 'private' so only people with URL can view. Only when choosing 'shared' will results be displayed publicly.",
    "docs.faq.q3.question": "Does the script require root?",
    "docs.faq.q3.answer":
      "No, the script doesn't require root. However, some tests may need certain permissions (e.g., ping test).",
    "docs.sidebar.quickStart": "Quick Start",
    "docs.sidebar.usage": "Usage Examples",
    "docs.sidebar.parameters": "Parameters",
    "docs.sidebar.technical": "Technical Details",
    "docs.sidebar.tests": "What it Tests",
    "docs.sidebar.faq": "FAQ",
    "docs.technical.title": "Technical Details",
    "docs.technical.howItWorks.title": "How the Script Works",
    "docs.technical.howItWorks.description":
      "The benchmark script performs comprehensive tests on your VPS to measure real-world performance:",
    "docs.technical.howItWorks.step1":
      "Collects system information (CPU, RAM, OS, virtualization)",
    "docs.technical.howItWorks.step2":
      "Runs disk I/O tests using dd (1GB file, 3 rounds, direct I/O)",
    "docs.technical.howItWorks.step3":
      "Runs FIO benchmark with multiple block sizes (4k, 64k, 512k, 1M)",
    "docs.technical.howItWorks.step4":
      "Optionally sends results to tocdovps.dev API for sharing",
    "docs.technical.ddTest.title": "DD Disk I/O Test",
    "docs.technical.ddTest.description":
      "Uses dd command to test sequential disk write and read speeds. This test provides a baseline measurement of disk performance.",
    "docs.technical.fioTest.title": "FIO Benchmark Test",
    "docs.technical.fioTest.description":
      "Uses FIO (Flexible I/O Tester) to perform advanced disk I/O benchmarks. FIO provides detailed metrics including IOPS and bandwidth for different block sizes.",
    "docs.technical.fioTest.note":
      "FIO is the industry standard for disk I/O benchmarking. Our configuration uses optimal settings (iodepth=16, runtime=30s, 500MB file) to ensure accurate and consistent results.",
    "docs.technical.bestPractices.title": "Best Practices",
    "docs.technical.bestPractices.item1":
      "Run tests when system load is low for more accurate results",
    "docs.technical.bestPractices.item2":
      "Ensure sufficient disk space (at least 2GB free for FIO tests)",
    "docs.technical.bestPractices.item3":
      "Tests use direct I/O to bypass cache and measure real disk performance",
    "docs.technical.bestPractices.item4":
      "Results may vary slightly between runs due to system load and disk state",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type TranslationKeys = keyof (typeof translations)[Locale];

export function getTranslation(locale: Locale, key: TranslationKeys): string {
  return translations[locale][key] ?? translations.vi[key] ?? key;
}
