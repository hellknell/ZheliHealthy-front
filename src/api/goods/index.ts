'use strict'

import http from "../../utils/http.ts";

let goodsService = {
    getAllGoods: function (params, resolve, reject) {
        http({
            params: params,
            url: "/mis/goods/selectGoods",
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    uploadImage: function (data, resolve, reject) {
        http({
            data: data,
            url: "/mis/goods/uploadImage",
            method: 'post'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    insertOrAddGoods(data, resolve, reject) {
        http({
            data: data,
            url: data.id != null ? "/mis/goods/updateGoods" : "/mis/goods/addGoods",
            method: 'post'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    updateStatus(data, resolve, reject) {
        http({
            data: data,
            url: "/mis/goods/updateStatus",
            method: 'put'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    searchGoodById(param, resolve, reject) {
        http({

            params: param,
            url: "/mis/goods/searchGoodById",
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    deleteGoodsById: function (param, resolve, reject) {
        http({
            params: param,
            url: "/mis/goods/deleteGoodsById",
            method: 'delete'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    selectById: function (param, resolve, reject) {
        http({
            params: param,
            url: "/front/goods/selectById",
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    searchIndexGoods: function (data, resolve, reject) {
        http({
            params: data,
            url: "/front/goods/searchIndexGoods",
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    searchGoodsList: function (param, resolve, reject) {
        http({
            params: param,
            url: "/front/goods/searchGoodsList",
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    searchSnapshot: function (param, url, resolve, reject) {
        http({
            params: param,
            url: url === 'mis' ? "/mis/goods/searchSnapshotForMis" : "/mis/goods/searchSnapshotForFront",
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))
    }
}
export default goodsService;


