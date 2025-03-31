const imagePaths = [
  'images/nomnomer.png',
  'images/nomnomer_mouthOpen.png',
  'images/flowers/1.png',
  'images/flowers/1_outlined.png',
  'images/flowers/2.png',
  'images/flowers/2_outlined.png',
  'images/flowers/3.png',
  'images/flowers/3_outlined.png',
  'images/flowers/4.png',
  'images/flowers/4_outlined.png',
  'images/flowers/5.png',
  'images/flowers/5_outlined.png',
  'images/flowers/bouquet/base.png',
  'images/flowers/bouquet/1_noStem.png',
  'images/flowers/bouquet/2_noStem.png',
  'images/flowers/bouquet/3_noStem.png',
  'images/flowers/bouquet/4_noStem.png',
  'images/flowers/bouquet/5_noStem.png',    
];
const preloadedImages = [];
imagePaths.forEach(src => {
  const img = new Image();
  img.src = src;
  preloadedImages.push(img);
});

let currentStage = 0;

const mainDisplayDiv = document.getElementById('mainDisplayDiv');
const mainDisplayText = document.getElementById('mainDisplayText');
const continueButton = document.getElementById('continueButton');

const flowerTypes = [
    'images/flowers/1.png',
    'images/flowers/2.png',
    'images/flowers/3.png',
    'images/flowers/4.png',
    'images/flowers/5.png'
]
const stemlessFlowerTypes = [
    'images/flowers/bouquet/1_noStem.png',
    'images/flowers/bouquet/2_noStem.png',
    'images/flowers/bouquet/3_noStem.png',
    'images/flowers/bouquet/4_noStem.png',
    'images/flowers/bouquet/5_noStem.png'
]

continueButton.addEventListener('click', () => {
    currentStage++
    updatePage();
})

function changeText(newText) {
    mainDisplayText.classList.add("hidden"); // Fade out
    
    setTimeout(() => {
        mainDisplayText.textContent = newText; // Change text
        mainDisplayText.classList.remove("hidden"); // Fade back in
        
    }, 500); // Wait for fade-out before changing text
}

function spawnFlowers() {
    const numClusters = Math.floor(Math.random() * 2) + 5;
    let clusterPositions = [];

    for (let i = 0; i < numClusters; i++) {
        let flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        let clusterSize = mainDisplayDiv.clientWidth < 600 ? 1 : Math.floor(Math.random() * 2) + 1;

        let clusterX, clusterY;
        let tooClose = true;

        while (tooClose) {
            clusterX = Math.random() * (mainDisplayDiv.clientWidth - (0.2 * mainDisplayDiv.clientWidth)) + (0.1 * mainDisplayDiv.clientWidth);
            clusterY = Math.random() * (mainDisplayDiv.clientHeight - (0.4 * mainDisplayDiv.clientHeight)) + (0.2 * mainDisplayDiv.clientHeight);
            tooClose = false;

            // Check if this new cluster is too close to existing ones
            for (let pos of clusterPositions) {
                let dx = pos.x - clusterX;
                let dy = pos.y - clusterY;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mainDisplayDiv.clientWidth * 0.1) { // Minimum spacing between clusters
                    tooClose = true;
                    break;
                }
            }

            console.log('too close');
        }
        clusterPositions.push({ x: clusterX, y: clusterY }); // Save position

        for (let j = 0; j < clusterSize; j++) {
            let flower = document.createElement("img");
            if (flowerTypes.indexOf(flowerType) != 1) {flower.className = "flower";}
            else {flower.className = "flower2";}
            flower.style.animation = `flowerAppear ${Math.random() * 1}s ease-out`;
            flower.src = flowerType;
            flower.dataset.originalSrc = flowerType;
            flower.dataset.outlineSrc = flowerType.replace(".png", "_outlined.png");

            // Random small offsets within the cluster
            let offsetX = (Math.random() - 0.5) * 0.1 * mainDisplayDiv.clientWidth;
            let offsetY = (Math.random() - 0.5) * 0.05 * mainDisplayDiv.clientHeight;

            flower.style.left = `${clusterX + offsetX}px`;
            flower.style.top = `${clusterY + offsetY}px`;

            flower.addEventListener("click", handleFlowerClick);

            mainDisplayDiv.appendChild(flower);
        }
    }
}

let selectedFlowers = [];
function handleFlowerClick(event) {
    let flower = event.target;
    let originalSrc = flower.dataset.originalSrc;
    let outlineSrc = flower.dataset.outlineSrc;

    // If already selected, remove it
    if (flower.classList.contains("selected")) {
        flower.classList.remove("selected");
        flower.src = originalSrc; // Switch back to original
        selectedFlowers = selectedFlowers.filter(f => f !== flower);
        continueButton.disabled = true;
    } 
    // If not selected & less than 3, select it
    else if (selectedFlowers.length < 3) {
        flower.classList.add("selected");
        flower.src = outlineSrc; // Switch to outlined version
        selectedFlowers.push(flower);
    }

    console.log("Selected Flowers:", selectedFlowers.length);
    continueButton.innerHTML = `${selectedFlowers.length}/3`;
    if (selectedFlowers.length == 3) {
        continueButton.innerHTML = `<img src="images/continueButtonIcon.gif" alt="continue" width="40%">`;
        continueButton.disabled = false;
    }
}

function addFlowersToBouquet(selectedFlowers) {
    let bouquetBase = document.getElementById("bouquetBase"); 
    
    // Create a container for flowers on top of the bouquet
    let bouquetContainer = document.createElement("div");
    bouquetContainer.id = 'bouquetFlowersContainer';
    bouquetContainer.style.position = "absolute";
    bouquetContainer.style.width = bouquetBase.clientWidth + "px";
    bouquetContainer.style.left = bouquetBase.offsetLeft + "px";
    bouquetContainer.style.top = bouquetBase.offsetTop + "px"; // Above bouquet
    bouquetContainer.style.pointerEvents = "none"; // Prevent interaction issues

    mainDisplayDiv.appendChild(bouquetContainer);

    let flowerPlacedPositions = []; // Store positions
    // Loop through the selected flowers and add them to the bouquet
    selectedFlowers.forEach(flowerType => {
        let flowerImg = document.createElement("img");
        flowerImg.src = stemlessFlowerTypes[flowerTypes.indexOf(flowerType.dataset.originalSrc)]; // Use selected flower type
        console.log(selectedFlowers);
        flowerImg.style.position = "absolute";
        flowerImg.style.width = "40%"; // Adjust size
        flowerImg.style.transform = `rotate(${Math.random() * 30 - 15}deg)`; // Random tilt
        flowerImg.style.opacity = "0"; // Start invisible for fade-in effect
        flowerImg.style.zIndex = '1';

        let flowerTop, flowerLeft;
        let tooClose = true;
        while (tooClose) {
            flowerTop = (Math.random() * 0.05 * bouquetBase.clientHeight) + (0.1 * bouquetBase.clientHeight);
            flowerLeft = Math.random() * (bouquetBase.clientWidth - (0.3 * bouquetBase.clientWidth));
            tooClose = false;

            // Check if this new flower is too close to existing ones
            for (let pos of flowerPlacedPositions) {
                let dx = pos.top - flowerTop;
                let dy = pos.left - flowerLeft;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < bouquetBase.clientWidth * 0.2) { // Minimum spacing between flowers
                    tooClose = true;
                    break;
                }
            }
            console.log('too close');
        }
        flowerPlacedPositions.push({ top: flowerTop, left: flowerLeft }); // Save position
        flowerImg.style.top = flowerTop + "px";
        flowerImg.style.left = flowerLeft + "px";

        bouquetContainer.appendChild(flowerImg);

        // Fade-in effect
        setTimeout(() => {
            flowerImg.style.transition = "opacity 0.5s ease-in";
            flowerImg.style.opacity = "1";
        }, 100);
    });
}


function updatePage() {
    switch (currentStage) {
        case 0:
            break;

        case 1:
            changeText(`
                Since no one gave you flowers for Valentine's, I've decided to give you some today ;)
            `);
            break;

        case 2:
            changeText(`
                Pick any 3 flowers!
            `);
            continueButton.disabled = true;
            continueButton.innerHTML = '0/3'
            setTimeout(() => {
                mainDisplayDiv.classList.toggle('field');
                console.log(mainDisplayDiv.classList);
                changeText('');
            }, 2000);
            setTimeout(spawnFlowers, 2500);
            break;

        case 3:
            changeText("Woahh. It looks so yummy!!");

            mainDisplayDiv.querySelectorAll('.flower, .flower2').forEach(flower => {
                flower.style.transition = "opacity 0.5s ease-out";
                flower.style.opacity = "0";
            });

            let bouquetBase = document.createElement('img');
            bouquetBase.id = 'bouquetBase';
            bouquetBase.src = 'images/flowers/bouquet/base.png';
            setTimeout(() => {
                mainDisplayDiv.appendChild(bouquetBase);
                mainDisplayDiv.classList.toggle('field');
                mainDisplayDiv.style.height = '60%';

                addFlowersToBouquet(selectedFlowers);
            }, 500);            
            break;

        case 4:
            console.log(document.getElementById('bouquetBase').getBoundingClientRect().bottom);
            changeText("A little too yummy...");
            continueButton.disabled = true;
            continueButton.innerHTML = '😋';

            let nomnomerImg = document.createElement('img');
            nomnomerImg.id = 'nomnomer';
            nomnomerImg.src = 'images/nomnomer.png';
            nomnomerImg.className = 'nomnomer';
            nomnomerImg.style.bottom = `${mainDisplayDiv.getBoundingClientRect().bottom - document.getElementById('bouquetBase').getBoundingClientRect().bottom}px`;
            console.log(nomnomerImg.style.bottom);

            setTimeout(() => {
                mainDisplayDiv.appendChild(nomnomerImg);
                console.log(document.getElementById('nomnomer').getBoundingClientRect().bottom);
                setTimeout(() => {
                    document.getElementById('nomnomer').src = 'images/nomnomer_mouthOpen.png';
                    setTimeout(() => {
                        document.getElementById('nomnomer').src = 'images/nomnomer.png';
                        document.getElementById('nomnomer').style.width = '20%';
                        document.getElementById('nomnomer').style.bottom = '50%';
                        document.getElementById('bouquetBase').classList.toggle('hidden');
                        document.getElementById('bouquetFlowersContainer').classList.toggle('hidden');
                        console.log();

                        setTimeout(() => {
                            changeText('Oops');
                            continueButton.innerHTML = '<img src="images/continueButtonIcon.gif" alt="continue" width="40%">';
                            continueButton.disabled = false;
                        })
                    }, 500)
                }, 500)
            }, 2500);            
            break;

        case 5:
            changeText('I ate your flowers.');
            break;

        case 6:
            changeText('APRIL FOOLS!! They were actualy just behind my face hehe.');
            document.getElementById('nomnomer').style.width = '0%';
            document.getElementById('bouquetBase').classList.toggle('hidden');
            document.getElementById('bouquetFlowersContainer').classList.toggle('hidden');
            continueButton.style.display = 'none'; 

        default:
            break;
    }
}
