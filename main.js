function togglePepperoni() {
      const wrap = document.getElementById('pepperoni-wrap');
      wrap.style.display =
        wrap.style.display === 'none' || wrap.style.display === ''
          ? 'flex'
          : 'none';
    }