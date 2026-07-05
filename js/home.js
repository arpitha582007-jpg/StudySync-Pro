// ================= Animated Stats Counter =================

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = +counter.getAttribute("data-target");

        let count = 0;
        const speed = target / 100;

        const updateCounter = () => {

            if (count < target) {

                count += speed;

                if (target === 95) {
                    counter.innerText = Math.ceil(count) + "%";
                }

                else if (target === 24) {
                    counter.innerText = Math.ceil(count);
                }

                else if (target >= 1000) {
                    counter.innerText = Math.ceil(count).toLocaleString();
                }

                setTimeout(updateCounter, 20);

            } else {

                if (target === 10000) {
                    counter.innerText = "10K+";
                }

                else if (target === 50000) {
                    counter.innerText = "50K+";
                }

                else if (target === 95) {
                    counter.innerText = "95%";
                }

                else if (target === 24) {
                    counter.innerText = "24";
                }

            }

        };

        updateCounter();
        counterObserver.unobserve(counter);

    });

});

counters.forEach(counter => {
    counterObserver.observe(counter);
});