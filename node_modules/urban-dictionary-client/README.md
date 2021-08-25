# `urban-dictionary-client`

[![Greenkeeper badge](https://badges.greenkeeper.io/jaebradley/urban-dictionary-client.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/jaebradley/urban-dictionary-client.svg?branch=master)](https://travis-ci.org/jaebradley/urban-dictionary-client)
[![codecov](https://codecov.io/gh/jaebradley/urban-dictionary-client/branch/master/graph/badge.svg)](https://codecov.io/gh/jaebradley/urban-dictionary-client)
[![npm](https://img.shields.io/npm/v/urban-dictionary-client.svg)](https://www.npmjs.com/package/urban-dictionary-client)
[![npm](https://img.shields.io/npm/dt/urban-dictionary-client.svg)](https://www.npmjs.com/package/urban-dictionary-client)

## Introduction

The world's dumbest client.

[Urban Dictionary](https://www.urbandictionary.com/) has [an unofficial exposed API endpoint](https://github.com/zdict/zdict/wiki/Urban-dictionary-API-documentation) - `http://api.urbandictionary.com/v0/define?term={word}`.

## API

```javascript
import { search } from 'urban-dictionary-client';

const jaeResults = await search('jae');
```
