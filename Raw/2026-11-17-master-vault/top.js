const r = document.querySelector('[id^="mv-row-"]'); r?.closest('.flex.flex-col')?.scrollIntoView({ block: 'start' }); window.scrollBy(0, -10); return document.scrollingElement.scrollTop;
