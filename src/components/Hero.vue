<template>
  <section class="hero__container">
    <div class="hero__signature"><h1>Artesanía de primera clase</h1></div>
    <h2 class="hero__title">Anillo de placa con zirconia</h2>
    <h2 class="hero__title">azul ajustable</h2>
    <div class="hero__message">
      <h3>
        Representa la elegancia y fuerza con zirconias color azul con un gran
        contraste
      </h3>
      <h3>con nuestra plata fina.</h3>
    </div>
    <div class="hero__button">
      <button>
        <span>Ver producto</span>
      </button>
    </div>
  </section>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.hero__container {
  padding: 80px 60px 0px 60px;
}

.hero__signature,
.hero__button {
  display: flex;
  justify-content: center;
}
.hero__signature > h1 {
  display: inline;
  background-color: #f8f8f8;
  color: #4f4f4f;
  letter-spacing: 1px;
  border-radius: 12px;
  padding: 2px 16px;
  font-size: 12px;
  line-height: 16.8px;
  margin: 0px;
  margin-bottom: 10px;
}

.hero__title {
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 64px;
  line-height: 76.8px;
  text-align: center;
  color: #2d2e36;
  margin: 0px;
}

.hero__message {
  margin-top: 15px;
}
.hero__message > h3 {
  font-size: 18px;
  line-height: 25.2px;
  text-align: center;
  margin: 0px;
}

.hero__button > button {
  margin-top: 20px;
  width: 260px;
  height: 50px;
  border-radius: 360px;
  padding: 2px 16px;
  background-color: #2f3033;
  color: #ffff;
  font-size: 16px;
  letter-spacing: 1px;
}
</style>
