// Test all payment methods functionality
const { defaultPaymentMethods } = require('./config/paymentMethods');
const database = require('./db/Database');

console.log('🔍 Testing Payment Methods System...\n');

// Initialize payment methods in database
defaultPaymentMethods.forEach(method => {
    database.savePaymentMethod(method);
});

console.log('📋 Available Payment Methods:');
console.log('=' .repeat(80));

const allMethods = database.getAllPaymentMethods();
allMethods.forEach((method, index) => {
    console.log(`${index + 1}. ${method.name}`);
    console.log(`   Type: ${method.type}`);
    console.log(`   Provider: ${method.provider}`);
    console.log(`   Fee Structure: ${method.fees.percentage}% + $${(method.fees.fixed/100).toFixed(2)}`);
    console.log(`   Processing Time: ${method.processingTime}`);
    console.log(`   Currencies: ${method.currencies.join(', ')}`);
    console.log(`   Countries: ${method.countries.join(', ')}`);
    console.log(`   Status: ${method.enabled ? '✅ Enabled' : '❌ Disabled'}`);
    console.log('');
});

console.log('💰 Fee Calculations for $1,000 Invoice:');
console.log('=' .repeat(50));

const testAmount = 1000;
allMethods.forEach(method => {
    const fee = method.calculateFee(testAmount);
    const total = testAmount + fee;
    const percentage = ((fee / testAmount) * 100).toFixed(2);
    
    console.log(`${method.name.padEnd(25)} | Fee: $${fee.toFixed(2).padStart(6)} (${percentage}%) | Total: $${total.toFixed(2)}`);
});

console.log('\n🌍 Payment Methods by Region:');
console.log('=' .repeat(40));

const regions = {
    'US': allMethods.filter(m => m.countries.includes('US')),
    'EU': allMethods.filter(m => m.countries.includes('EU')),
    'CA': allMethods.filter(m => m.countries.includes('CA')),
    'GB': allMethods.filter(m => m.countries.includes('GB')),
    'AU': allMethods.filter(m => m.countries.includes('AU'))
};

Object.entries(regions).forEach(([region, methods]) => {
    console.log(`\n${region} (${methods.length} methods):`);
    methods.forEach(method => {
        console.log(`  • ${method.name} (${method.type})`);
    });
});

console.log('\n💳 Payment Methods by Type:');
console.log('=' .repeat(35));

const types = [...new Set(allMethods.map(m => m.type))];
types.forEach(type => {
    const methodsOfType = allMethods.filter(m => m.type === type);
    console.log(`\n${type.toUpperCase()} (${methodsOfType.length} methods):`);
    methodsOfType.forEach(method => {
        console.log(`  • ${method.name} - ${method.provider}`);
    });
});

console.log('\n💱 Supported Currencies:');
console.log('=' .repeat(25));

const currencies = [...new Set(allMethods.flatMap(m => m.currencies))];
console.log(currencies.sort().join(', ').toUpperCase());

console.log('\n⚡ Processing Speed Analysis:');
console.log('=' .repeat(35));

const speeds = {
    'instant': allMethods.filter(m => m.processingTime === 'instant'),
    '1-3 business days': allMethods.filter(m => m.processingTime === '1-3 business days'),
    '1-5 business days': allMethods.filter(m => m.processingTime === '1-5 business days'),
    'other': allMethods.filter(m => !['instant', '1-3 business days', '1-5 business days'].includes(m.processingTime))
};

Object.entries(speeds).forEach(([speed, methods]) => {
    if (methods.length > 0) {
        console.log(`\n${speed.toUpperCase()} (${methods.length} methods):`);
        methods.forEach(method => {
            console.log(`  • ${method.name}`);
        });
    }
});

console.log('\n🏆 Recommended Payment Methods:');
console.log('=' .repeat(40));

console.log('\nLowest Fees:');
const sortedByFee = allMethods
    .map(method => ({ method, fee: method.calculateFee(testAmount) }))
    .sort((a, b) => a.fee - b.fee)
    .slice(0, 3);

sortedByFee.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.method.name} - $${item.fee.toFixed(2)} fee`);
});

console.log('\nFastest Processing:');
const instantMethods = allMethods.filter(m => m.processingTime === 'instant');
instantMethods.slice(0, 3).forEach((method, index) => {
    const fee = method.calculateFee(testAmount);
    console.log(`  ${index + 1}. ${method.name} - $${fee.toFixed(2)} fee (instant)`);
});

console.log('\nMost Universal (Countries):');
const sortedByCountries = allMethods
    .sort((a, b) => b.countries.length - a.countries.length)
    .slice(0, 3);

sortedByCountries.forEach((method, index) => {
    console.log(`  ${index + 1}. ${method.name} - ${method.countries.length} countries`);
});

console.log('\n✅ Payment Methods System Test Complete!');
console.log('\nSummary:');
console.log(`📊 Total Methods: ${allMethods.length}`);
console.log(`🌍 Countries Supported: ${[...new Set(allMethods.flatMap(m => m.countries))].length}`);
console.log(`💱 Currencies Supported: ${currencies.length}`);
console.log(`⚡ Instant Methods: ${instantMethods.length}`);
console.log(`🔒 Enabled Methods: ${allMethods.filter(m => m.enabled).length}`);

console.log('\n🚀 Ready to process payments with comprehensive options!');