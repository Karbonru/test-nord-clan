<template>
  <div class="wrap_404">
    <h1 class="glitch display-1 font-weight-light" data-text="404 Страница не найдена">
      404 Страница не найдена
    </h1> 
  </div>
</template>

<script>
export default {
  name: "IndexViewer",
  data: () => ({

  }),
  methods: {

  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/variable.scss';

.wrap_404{
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.glitch{
  color:$primary;
  position:relative;
  margin:0 auto;
}
@keyframes noise-anim{
  $steps:20;
  @for $i from 0 through $steps{
    #{percentage($i*(1/$steps))}{
      clip:rect(random(100)+px,9999px,random(100)+px,0);
    }
  }
}
.glitch:after{
  content:attr(data-text);
  position:absolute;
  left:2px;
  text-shadow:-1px 0 $error;
  top:0;
  color:$secondary;
  background:$bg;
  overflow:hidden;
  clip:rect(0,900px,0,0); 
  animation:noise-anim 2s infinite linear alternate-reverse;
}

@keyframes noise-anim-2{
  $steps:20;
  @for $i from 0 through $steps{
    #{percentage($i*(1/$steps))}{
      clip:rect(random(100)+px,9999px,random(100)+px,0);
    }
  }
}
.glitch:before{
  content:attr(data-text);
  position:absolute;
  left:-2px;
  text-shadow:1px 0 $warnlblue; 
  top:0;
  color:$secondary;
  background:$bg;
  overflow:hidden;
  clip:rect(0,900px,0,0); 
  animation:noise-anim-2 3s infinite linear alternate-reverse;
}
</style>
