import { uniqueId } from 'lodash';
import * as onChange from 'on-change';

export default () => {
    const btnChange = document.querySelector('.btn-change')
    const btnConvert = document.querySelector('.btn-convert')

    const listItemsFrom = document.querySelector('.list-from').querySelectorAll('.dropdown-item');
    const listItemsTo = document.querySelector('.list-to').querySelectorAll('.dropdown-item');

    const btnLeft = document.querySelector('.btn-left')
    const btnRight = document.querySelector('.btn-right')

    const state = {
        swap: false,
        current: null,
        newClose: null,
        leftBtn: btnLeft,
        rightBtn: btnRight,
    }

    const watchedState = onChange(state, (path, value) => {
      if (path === 'newClose') {
          value.remove();
      }
      if (path === 'current') {
          renderItem();
      }
      if (path === 'swap') {
          const temp = btnRight.innerHTML;
          
          btnRight.innerHTML = btnLeft.innerHTML;
          btnLeft.innerHTML = temp;

          const leftAtr = btnLeft.dataset.abr;
          const rightAtr = btnRight.dataset.abr;

          btnLeft.dataset.abr = rightAtr;
          btnRight.dataset.abr = leftAtr;

          state.leftBtn = btnLeft;
          state.rightBtn = btnRight;
      }
      if (path === 'leftBtn') {
          btnLeft.dataset.abr = value.dataset.abr;
          btnLeft.innerHTML = `
          <img src="../images/flags/${value.dataset.abr}.png" class="h-40" alt="">
          <div class="d-flex btn-text-layout">
          <b class="from">${value.dataset.abr}</b>
          <span>${value.dataset.fn}</span>
          `;
      }
      if (path === 'rightBtn') {
          btnRight.dataset.abr = value.dataset.abr;
          btnRight.innerHTML = `
          <img src="../images/flags/${value.dataset.abr}.png" class="h-40" alt="">
          <div class="d-flex btn-text-layout">
          <b class="from">${value.dataset.abr}</b>
          <span>${value.dataset.fn}</span>
          `
      }
  })

    const renderItem = () => {
      const container = document.querySelector('ul');
      const li = document.createElement('li');
      const abrFrom = state.leftBtn.dataset.abr;
      const abrTo = state.rightBtn.dataset.abr;
      const { amount, id } = state.current;

      li.innerHTML = `1 ${abrFrom} = ${amount} ${abrTo} <span class="close">x</span>`;
      li.classList.add('list-group-item', 'list-group-item-primary');
      li.setAttribute('id', id);
      container.append(li);

      const closeBtn = document.getElementById(id);
      closeBtn.addEventListener('click', () => watchedState.newClose = closeBtn);
    }

    Array.from(listItemsFrom).map((item) => {
        item.addEventListener('click', () => watchedState.leftBtn = item)
    })

    Array.from(listItemsTo).map((item) => {
        item.addEventListener('click', () => watchedState.rightBtn = item)
    })

    btnChange.addEventListener('click', () => watchedState.swap = state.swap === true ? false : true)

    btnConvert.addEventListener('click', () => {
        const from = state.leftBtn.dataset.abr;
        const to = state.rightBtn.dataset.abr;

        fetch(`https://api.ratesapi.io/api/latest?base=${from}&symbols=${to}`)
            .then((response) => response.json())
            .then((data) => {
                const newCurrent = {
                    amount: data.rates[to],
                    from: from,
                    to: to,
                    id: uniqueId()
                }
                watchedState.current = newCurrent
            })
            .catch(console.error)
    })
}
