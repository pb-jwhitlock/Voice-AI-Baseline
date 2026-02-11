const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Node.js Project Structure', () => {
  const projectRoot = path.resolve(__dirname, '..'); // Assuming tests are in a 'test' directory

  it('should have a package.json file', () => {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    assert.ok(fs.existsSync(packageJsonPath), 'package.json should exist');
  });

  it('should have express and dotenv as dependencies in package.json', () => {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    assert.ok(packageJson.dependencies, 'package.json should have dependencies');
    assert.ok(packageJson.dependencies.express, 'express should be a dependency');
    assert.ok(packageJson.dependencies.dotenv, 'dotenv should be a dependency');
  });

  it('should have a start script in package.json', () => {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    assert.ok(packageJson.scripts, 'package.json should have scripts');
    assert.ok(packageJson.scripts.start, 'start script should exist');
  });

  it('should have a test script in package.json', () => {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    assert.ok(packageJson.scripts, 'package.json should have scripts');
    assert.ok(packageJson.scripts.test, 'test script should exist');
  });
});
