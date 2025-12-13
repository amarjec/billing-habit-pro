export const inventoryTemplates = {
    'electrical': [
        {
            category: "Wiring",
            subCategories: [
                {
                    name: "Wires & Cables",
                    products: [
                        { label: "0.75mm Wire Coil", unit: "coil", sellingPrice: 0 },
                        { label: "1.0mm Wire Coil", unit: "coil", sellingPrice: 0 },
                        { label: "1.5mm Wire Coil", unit: "coil", sellingPrice: 0 },
                        { label: "2.5mm Wire Coil", unit: "coil", sellingPrice: 0 },
                    ]
                },
                {
                    name: "Switches & Sockets",
                    products: [
                        { label: "1 Way Switch", unit: "box", sellingPrice: 0 },
                        { label: "2 Way Switch", unit: "box", sellingPrice: 0 },
                        { label: "5 Pin Socket", unit: "box", sellingPrice: 0 },
                    ]
                }
            ]
        },
        {
            category: "Lighting",
            subCategories: [
                {
                    name: "LED Bulbs",
                    products: [
                        { label: "9W LED Bulb", unit: "pc", sellingPrice: 0 },
                        { label: "12W LED Bulb", unit: "pc", sellingPrice: 0 },
                        { label: "Tube Light 20W", unit: "pc", sellingPrice: 0 },
                    ]
                }
            ]
        }
    ],
    'sanitary': [
        {
            category: "Faucets",
            subCategories: [
                {
                    name: "Taps",
                    products: [
                        { label: "Bib Cock", unit: "pc", sellingPrice: 0 },
                        { label: "Pillar Cock", unit: "pc", sellingPrice: 0 },
                        { label: "Long Body", unit: "pc", sellingPrice: 0 },
                    ]
                }
            ]
        },
        {
            category: "Pipes",
            subCategories: [
                {
                    name: "CPVC Pipes",
                    products: [
                        { label: "1/2 inch CPVC", unit: "length", sellingPrice: 0 },
                        { label: "3/4 inch CPVC", unit: "length", sellingPrice: 0 },
                        { label: "1 inch CPVC", unit: "length", sellingPrice: 0 },
                    ]
                }
            ]
        }
    ],
    'grocery': [
        {
            category: "Staples",
            subCategories: [
                {
                    name: "Flour & Rice",
                    products: [
                        { label: "Wheat Flour 5kg", unit: "pkt", sellingPrice: 0 },
                        { label: "Basmati Rice 1kg", unit: "pkt", sellingPrice: 0 },
                    ]
                },
                {
                    name: "Oil & Ghee",
                    products: [
                        { label: "Mustard Oil 1L", unit: "btl", sellingPrice: 0 },
                        { label: "Refined Oil 1L", unit: "pouch", sellingPrice: 0 },
                    ]
                }
            ]
        }
    ],
    'mobile': [
        {
            category: "Accessories",
            subCategories: [
                {
                    name: "Chargers",
                    products: [
                        { label: "Type-C Cable", unit: "pc", sellingPrice: 0 },
                        { label: "20W Adapter", unit: "pc", sellingPrice: 0 },
                    ]
                },
                {
                    name: "Audio",
                    products: [
                        { label: "Wired Earphones", unit: "pc", sellingPrice: 0 },
                        { label: "Bluetooth Neckband", unit: "pc", sellingPrice: 0 },
                    ]
                }
            ]
        }
    ]
};