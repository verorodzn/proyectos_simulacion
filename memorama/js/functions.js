var deck = ["1.png", "1.png", "2.png", "2.png", "3.png", "3.png", "4.png", "4.png", "5.png", "5.png", "6.png", "6.png",
            "7.png", "7.png", "8.png", "8.png", "9.png", "9.png", "10.png", "10.png", "11.png", "11.png", "12.png", "12.png",
            "13.png", "13.png", "14.png", "14.png", "15.png", "15.png", "16.png", "16.png", "17.png", "17.png", "18.png", "18.png",
            "19.png", "19.png", "20.png", "20.png", "21.png", "21.png", "22.png", "22.png", "23.png", "23.png", "24.png", "24.png",
            "25.png", "25.png", "26.png", "26.png", "27.png", "27.png", "28.png", "28.png", "29.png", "29.png", "30.png", "30.png",
            "31.png", "31.png", "32.png", "32.png"
];

function flipCard(img, i) {
    img.src = "./set1/" + deck[i];
}