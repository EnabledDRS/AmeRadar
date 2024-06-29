document.addEventListener('DOMContentLoaded', async function () {
    const regionSelect = document.getElementById('regionSelect');
    const slider = document.getElementById('timeSlider');
    const image = document.getElementById('sliderImage');
    const speedDisplay = document.getElementById('speedDisplayContainer');
    const fasterButton = document.getElementById('fasterButton');
    const slowerButton = document.getElementById('slowerButton');
    const playPauseButton = document.getElementById('playPauseButton');
    const lastRefresh = document.getElementById('lastRefresh');
    const timeDisplay = document.getElementById('timeDisplay');

    const baseURL = "https://radar.kma.go.kr/cgi-bin/center/nph-rdr_cmp_img?cmp=HSP&color=C4&qcd=HSO&obs=ECHO&map=HB&size=1000&gis=1&legend=1&aws=1&gov=KMA&gc=T&gc_itv=60&center=0&topo=0";
    const regionConfigs = {
        nationwide: { url: "&lonlat=0&lat=35.90&lon=127.80&zoom=2&wv=1&ht=1000", interval: 5, frames: 48 },
        seoul: { url: "&lonlat=0&lat=37.57&lon=126.97&zoom=4.9&wv=1&ht=1000&topo=1", interval: 5, frames: 24 },
        chungcheong: { url: "&lonlat=0&lat=36.49&lon=127.24&zoom=4.9&wv=1&ht=1000&topo=1", interval: 5, frames: 24 },
        honam: { url: "&lonlat=0&lat=35.17&lon=126.89&zoom=4.9&wv=1&ht=1000&topo=1", interval: 5, frames: 24 },
        gyeongnam: { url: "&lonlat=0&lat=35.22&lon=128.67&zoom=4.9&wv=1&ht=1000&topo=1", interval: 5, frames: 24 },
        gyeongbuk: { url: "&lonlat=0&lat=36.25&lon=128.56&zoom=4.9&wv=1&ht=1000&topo=1", interval: 5, frames: 24 },
        gangwon: { url: "&lonlat=0&lat=37.78&lon=128.40&zoom=4.9&wv=1&ht=1000&topo=1", interval: 5, frames: 24 },
        jeju: { url: "&lonlat=0&lat=33.38&lon=126.53&zoom=4.9&wv=1&ht=1000&topo=1", interval: 5, frames: 24 },
        eastAsia: { url: "&lonlat=1&lat=33.11&lon=126.27&zoom=0.5&wv=0&ht=1000&topo=0", interval: 30, frames: 48 }
    };

    let selectedRegionConfig = regionConfigs['nationwide'];
    let intervalId;
    let isPlaying = true;
    let preloadedImages = [];
    let speed = parseInt(localStorage.getItem('speed')) || 500; // Default speed in milliseconds or saved value
    let imageTimes = [];

    // Load selected region from localStorage
    const savedRegion = localStorage.getItem('selectedRegion');
    if (savedRegion) {
        selectedRegionConfig = regionConfigs[savedRegion];
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
            return `${y}년 ${m}월 ${d}일 ${h}시 ${min}분`;
        }
    }

    async function generateImageURLs() {
        const urls = [];
        const nowKST = await getInternetTime();
        const interval = selectedRegionConfig.interval;

        nowKST.setMinutes(Math.floor(nowKST.getMinutes() / interval) * interval);
        nowKST.setSeconds(0);
        nowKST.setMilliseconds(0);

        imageTimes = [];

        for (let i = 0; i < selectedRegionConfig.frames; i++) {
            const date = new Date(nowKST.getTime() - i * interval * 60000);
            const formattedDate = formatDate(date);
            urls.push(`${baseURL}${selectedRegionConfig.url}&tm=${formattedDate}`);
            imageTimes.push(date);
        }
        return urls.reverse();
    }

    async function updateImages() {
        const images = await generateImageURLs();
        preloadedImages = images.map((url, index) => {
            const img = new Image();
            img.src = url;
            return { img, time: imageTimes[imageTimes.length - 1 - index] };
        });

        // Update the image source and time display based on slider value
        slider.max = selectedRegionConfig.frames;
        slider.addEventListener('input', function () {
            const index = slider.value - 1;
            image.src = preloadedImages[index].img.src;
            timeDisplay.textContent = formatDate(preloadedImages[index].time, "display");
        });

        // Initialize the first image and time display
        image.src = preloadedImages[0].img.src;
        timeDisplay.textContent = formatDate(preloadedImages[0].time, "display");

        // Set up the automatic slide show
        startAutoPlay();
    }

    function startAutoPlay() {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            slider.value = (parseInt(slider.value) % selectedRegionConfig.frames) + 1;
            const index = slider.value - 1;
            image.src = preloadedImages[index].img.src;
            timeDisplay.textContent = formatDate(preloadedImages[index].time, "display");
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
        selectedRegionConfig = regionConfigs[regionSelect.value];
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
