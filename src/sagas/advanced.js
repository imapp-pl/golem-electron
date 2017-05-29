import { eventChannel, buffers } from 'redux-saga'
import { fork, takeLatest, take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_ADVANCED_PRESET, CREATE_ADVANCED_PRESET, DELETE_ADVANCED_PRESET, SET_ADVANCED_CHART} = dict

function deleteFunc(session, payload) {
    return new Promise((resolve, reject) => {
        function on_delete_preset(args) {
            var deleted_preset = args[0];
            console.log(config.PRESET_CREATE_RPC, deleted_preset)
            resolve(deleted_preset)
        }
        console.log(config.PRESET_CREATE_RPC, payload)
        _handleRPC(on_delete_preset, session, config.PRESET_DELETE_RPC, [payload])
    })
}

export function* deletePreset(session, {payload}) {
    yield call(deleteFunc, session, payload)
    const action = yield call(subscribeAdvanced, session)
    console.log("ADVANCED_ACTION", action)
    yield action && put(action)
}

function createFunc(session, payload) {
    return new Promise((resolve, reject) => {
        function on_create_preset(args) {
            var created_preset = args[0];
            console.log(config.PRESET_CREATE_RPC, created_preset)
            resolve(created_preset)
        }

        _handleRPC(on_create_preset, session, config.PRESET_CREATE_RPC, [payload])
    })
}

export function* createPreset(session, {payload}) {
    yield call(createFunc, session, payload)
    const action = yield call(subscribeAdvanced, session)
    console.log("ADVANCED_ACTION", action)
    yield action && put(action)
}

export function subscribeAdvanced(session) {
    return new Promise((resolve, reject) => {

        function on_custom_presets(args) {
            var custom_presets = args[0];
            console.log(config.PRESETS_RPC, custom_presets)
            resolve({
                type: SET_ADVANCED_PRESET,
                payload: custom_presets
            })
        }

        _handleRPC(on_custom_presets, session, config.PRESETS_RPC)
    })
}

export function* fireBase(session) {
    const action = yield call(subscribeAdvanced, session)
    console.log("ADVANCED_ACTION", action)
    yield action && put(action)
}

export function* advancedFlow(session) {
    yield fork(fireBase, session)
    yield takeLatest(CREATE_ADVANCED_PRESET, createPreset, session)
    yield takeLatest(DELETE_ADVANCED_PRESET, deletePreset, session)
}