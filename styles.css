document.addEventListener('DOMContentLoaded', async function () {
    const regionSelect = document.getElementById('regionSelect');
    const slider = document.getElementById('timeSlider');
    const image = document.getElementById('sliderImage');
    const speedDisplay = document.getElementById('speedDisplayContainer');
    const fasterButton = document.getElementById('fasterButton');
    const slowerButton = document.getElementById('slowerButton');
    const playPauseButton = document.getElementById('playPauseButton');
    const lastRefresh = document.getElementById('lastRefresh');

    const regionURLs = {
        nationwide: "https://radar.kma.go.kr/cgi-bin/center/nph-rdr_cmp_img?cmp=HSP&color=C2&qcd=HSO&obs=ECHO&map=HB&size=1000&xp=720&yp=614&ht=700&zoom=2&lonlat=1&gis=1&legend=1&aws=1&gov=KMA&color=C4&wv=1&ht=800&topo=1&gc=T&gc_itv=60&tm=",
        seoul: "https://radar.kma.go.kr/cgi-bin/center/nph-rdr_cmp_img?cmp=HSP&color=C2&qcd=HSO&obs=ECHO&map=HB&size=1000&xp=630&yp=790&ht=700&zoom=4.9&lonlat=1&gis=1&legend=1&aws=1&gov=KMA&color=C4&wv=1&ht=2000&topo=1&gc=T&gc_itv=60&tm=",
        chungcheong: "https://radar.kma.go.kr/cgi-bin/center/nph-rdr_cmp_img?cmp=HSP&color=C2&qcd=HSO&obs=ECHO&map=HB&size=1000&xp=675&yp=680&ht=700&zoom=4.9&lonlat=1&gis=1&legend=1&aws=1&gov=KMA&color=C4&wv=1&ht=2000&topo=1&gc=T&gc_itv=60&tm=",
        honam: "https://radar.kma.go.kr/cgi-bin/center/nph-rdr_cmp_img?cmp=HSP&color=C2&qcd=HSO&obs=ECHO&map=HB&size=1000&xp=630&yp=528&ht=700&zoom=4.9&lonlat=1&gis=1&legend=1&aws=1&gov=KMA&color=C4&wv=1&ht=2000&topo=1&gc=T&gc_itv=60&tm=",
        gyeongnam: "https://radar.kma.go.kr/cgi-bin/center/nph-rdr_cmp_img?cmp=HSP&color=C2&qcd=HSO&obs=ECHO&map=HB&size=1000&xp=790&yp=550&ht=700&zoom=4.9&lonlat=1&gis=1&legend=1&aws=1&gov=KMA&color=C4&wv=1&ht=2000&topo=1&gc=T&gc_itv=60&tm=",
        gyeongbuk: "https://radar.kma.go.kr/cgi-bin/center/nph-rdr_cmp_img?cmp=HSP&color=C2&qcd=HSO&obs=ECHO&map=HB&size=1000&xp=800&yp=660&ht=700&zoom=4.9&lonlat=1&gis=1&legend=1&aws=1&gov=KMA&color=C4&wv=1&ht=2000&topo=1&gc=T&gc_itv=60&tm=",
        gangwon: "https://radar.kma.go.kr/cgi-bin/center/nph-rdr_cmp_img?cmp=HSP&color=C2&qcd=HSO&obs=ECHO&map=HB&size=1000&xp=760&yp=820&ht=700&zoom=4.9&lonlat=1&gis=1&legend=1&aws=1&gov=KMA&color=C4&wv=1&ht=2000&topo=1&gc=T&gc_itv=60&tm=",
        jeju: "https://radar.kma.go.kr/cgi-bin/center/nph-rdr_cmp_img?cmp=HSP&color=C2&qcd=HSO&obs=ECHO&map=HB&size=1000&xp=610&yp=340&ht=700&zoom=4.9&lonlat=1&gis=1&legend=1&aws=1&gov=KMA&color=C4&wv=1&ht=2000&topo=1&gc=T&gc_itv=60&tm="
    };

    let baseURL = regionURLs['nationwide'];
    let intervalId;
    let isPlaying = true;
    let preloadedImages = [];
    let speed = parseInt(localStorage.getItem('speed')) || 500; // Default speed in milliseconds or saved value

    // Load selected region from localStorage
    const savedRegion = localStorage.getItem('selectedRegion');
    if (savedRegion) {
        baseURL = regionURLs[savedRegion];
        regionSelect.value = savedRegion;
    }

    async function getInternetTime() {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Seoul');
        const data = await response.json();
        return new Date(data.datetime);
    }

    function formatDate(date, type = "url") {
        const y = date.getFullYear();
        const m = ('0' + (date.getMonth() + 1)).slice(-2);
        const d = ('0' + date.getDate()).slice(-2);
        const h = ('0' + date.getHours()).slice(-2);
        const min = ('0' + date.getMinutes()).slice(-2);
        const s = ('0' + date.getSeconds()).slice(-2);
        if (type === "url") {
            return `${y}${m}${d}${h}${min}`;
        } else {
            return `${y}.${m}.${d} ${h}:${min}:${s}`;
        }
    }

    async function generateImageURLs() {
        const urls = [];
        const nowKST = await getInternetTime();

        nowKST.setMinutes(Math.floor(nowKST.getMinutes() / 5) * 5);
        nowKST.setSeconds(0);
        nowKST.setMilliseconds(0);

        for (let i = 0; i < 24; i++) {
            const date = new Date(nowKST.getTime() - i * 5 * 60000);
            const formattedDate = formatDate(date);
            urls.push(baseURL + formattedDate);
        }
        return urls.reverse();
    }

    async function updateImages() {
        const images = await generateImageURLs();
        preloadedImages = images.map(url => {
            const img = new Image();
            img.src = url;
            return img;
        });

        // Update the image source based on slider value
        slider.addEventListener('input', function () {
            const index = slider.value - 1;
            image.src = preloadedImages[index].src;
        });

        // Initialize the first image
        image.src = preloadedImages[0].src;

        // Set up the automatic slide show
        startAutoPlay();
    }

    function startAutoPlay() {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            slider.value = (parseInt(slider.value) % 24) + 1;
            const index = slider.value - 1;
            image.src = preloadedImages[index].src;
        }, speed);
    }

    playPauseButton.addEventListener('click', function () {
        if (isPlaying) {
            clearInterval(intervalId);
            playPauseButton.textContent = '재생';
        } else {
            startAutoPlay();
            playPauseButton.textContent = '정지';
        }
        isPlaying = !isPlaying;
    });

    fasterButton.addEventListener('click', function () {
        if (speed > 100) {
            speed -= 100;
            speedDisplay.textContent = `${(speed / 1000).toFixed(1)} s/frame`;
            localStorage.setItem('speed', speed); // Save speed to localStorage
            if (isPlaying) {
                clearInterval(intervalId);
                startAutoPlay();
            }
        }
    });

    slowerButton.addEventListener('click', function () {
        if (speed < 2000) {
            speed += 100;
            speedDisplay.textContent = `${(speed / 1000).toFixed(1)} s/frame`;
            localStorage.setItem('speed', speed); // Save speed to localStorage
            if (isPlaying) {
                clearInterval(intervalId);
                startAutoPlay();
            }
        }
    });

    regionSelect.addEventListener('change', function () {
        baseURL = regionURLs[regionSelect.value];
        localStorage.setItem('selectedRegion', regionSelect.value); // Save selected region to localStorage
        updateImages();
    });

    // Initial load
    await updateImages();

    // Display the correct speed on page load
    speedDisplay.textContent = `${(speed / 1000).toFixed(1)} s/frame`;

    // Update last refresh time
    lastRefresh.textContent += formatDate(new Date(), "display");

    // Auto refresh every 5 minutes (300,000 milliseconds)
    setInterval(() => {
        location.reload();
    }, 300000);
});
