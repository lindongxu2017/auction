<template>
    <div class="blankPage">
        
    </div>
</template>

<script>
    export default {
        name: 'blankPage',
        data () {
            return {
                id: ''
            }
        },
        mounted () {
            this.id = this.$route.params.uid;
            this.gostep();
        },
        methods: {
            gostep () {
                myFn.ajax('post', {uid: this.id}, apiAddress.admin.setUserDown, (res) => {
                    this.$router.push({name: 'home'})
                });
            }
        }
    }
</script>