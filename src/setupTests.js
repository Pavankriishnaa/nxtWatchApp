/* eslint-disable */
import '@testing-library/jest-dom'
import {configure} from '@testing-library/react'

configure({asyncWrapper: async fn => fn()})
