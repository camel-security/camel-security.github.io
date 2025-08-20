# 🐪 CaMeL Security Visualizer

An interactive React application that visualizes and demonstrates Google's CaMeL (Capabilities for Machine Learning) security approach for defending against prompt injections in LLM agents.

## Overview

CaMeL uses a dual-LLM pattern to protect against prompt injection attacks:
- **Privileged LLM (P-LLM)**: Only sees trusted user queries and generates code/control flow
- **Quarantined LLM (Q-LLM)**: Processes untrusted data without tool access
- **Security Policies**: Track data provenance and enforce access controls
- **Custom Interpreter**: Maintains data flow graphs and enforces policies

## Features

### 🎯 Core Components
- **Dual Input System**: Separate inputs for trusted queries and untrusted data
- **Policy Editor**: Define security policies with a simple syntax
- **Code Generation Display**: Shows P-LLM generated code and Q-LLM data extraction
- **Data Flow Visualization**: Interactive graph showing data dependencies and capabilities
- **Execution Log**: Step-by-step execution with policy checks
- **Attack Detection**: Real-time alerts when attacks are blocked

### 🛡️ Security Features
- **Data Provenance Tracking**: Every value tracks its sources and readers
- **Capability-based Security**: Fine-grained access control
- **Policy Enforcement**: Configurable security policies (Normal/Strict modes)
- **Attack Pattern Detection**: Identifies common prompt injection patterns

### 📚 Educational Components
- **Example Scenarios**: Pre-configured attack and benign scenarios
- **Step-by-step Mode**: Walk through execution one step at a time
- **Interactive Tooltips**: Learn about each component
- **Visual Feedback**: Color-coded data trust levels

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## Usage

### Quick Start
1. Select an example scenario from the "Example Scenarios" section
2. Click "Execute" to see how CaMeL processes the request
3. Observe the execution log and data flow graph
4. Try modifying the policies or inputs to see different outcomes

### Policy Syntax
```
POLICY tool_name:
  - condition1
  - condition2
```

Available conditions:
- `recipient IN trusted_contacts` - Check if value is in allowed list
- `data.source NOT IN untrusted_sources` - Verify data provenance
- `name NOT CONTAINS confidential` - Ensure no forbidden terms
- `data.readers INCLUDES recipient` - Check read permissions

### Modes
- **Normal Mode**: Standard policy enforcement
- **Strict Mode**: Blocks any data from untrusted sources

## Example Attack Scenarios

### Hidden Instruction Injection
Untrusted data contains hidden instructions attempting to override the original query.

### Recipient Hijacking
Malicious content tries to change the email recipient to an attacker's address.

### Data Exfiltration
Attempts to access and send confidential documents.

### Privilege Escalation
Trying to bypass access controls and gain unauthorized permissions.

## Development

```bash
# Run development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Security Concepts Demonstrated

1. **Isolation**: Untrusted data never reaches the privileged LLM
2. **Least Privilege**: Q-LLM has no tool access
3. **Data Provenance**: Track where data comes from
4. **Capability-based Security**: Fine-grained access control
5. **Policy Enforcement**: Configurable security rules
6. **Defense in Depth**: Multiple layers of protection

## License

MIT

## Acknowledgments

Based on Google's CaMeL (Capabilities for Machine Learning) research for defending against prompt injections in LLM agents.

## References

- **Official CaMeL Repository**: [https://github.com/google-research/camel-prompt-injection](https://github.com/google-research/camel-prompt-injection)
- **Research Paper**: [Defeating Prompt Injections by Design](https://arxiv.org/abs/2503.18813)
- **Authors**: Edoardo Debenedetti, Ilia Shumailov, Tianqi Fan, Jamie Hayes, Nicholas Carlini, Daniel Fabian, Christoph Kern, Chongyang Shi, Florian Tramèr
