#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { MyAwsProjectStack } from '../lib/my-aws-project-stack';

const app = new cdk.App();

const isLocalStack = process.env.AWS_ENDPOINT_URL === 'http://localhost:4566';

new MyAwsProjectStack(app, 'MyAwsProjectStack', {
  env: {
    account: isLocalStack ? '000000000000' : process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.AWS_REGION || 'eu-west-1',
  },
  description: isLocalStack ? 'Local development with LocalStack' : 'AWS Production',
});
