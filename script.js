let heightUnit = 'metric';
let weightUnit = 'kg';

function setHeightUnit(unit) {
  heightUnit = unit;
  document.querySelectorAll('#heightToggle button').forEach(b => {
    b.classList.toggle('active', b.dataset.unit === unit);
  });
  document.getElementById('metricHeight').classList.toggle('hidden', unit === 'imperial');
  document.getElementById('imperialHeight').classList.toggle('visible', unit === 'imperial');
}

function setWeightUnit(unit) {
  weightUnit = unit;
  document.querySelectorAll('#weightToggle button').forEach(b => {
    b.classList.toggle('active', b.dataset.unit === unit);
  });
  document.getElementById('weightSuffix').textContent = unit;
  document.getElementById('weight').placeholder = unit === 'kg' ? '70' : '154';
}

function getHeightInCm() {
  if (heightUnit === 'metric') {
    return parseFloat(document.getElementById('heightCm').value);
  }
  const ft = parseFloat(document.getElementById('heightFt').value) || 0;
  const inch = parseFloat(document.getElementById('heightIn').value) || 0;
  return (ft * 12 + inch) * 2.54;
}

function getWeightInKg() {
  const w = parseFloat(document.getElementById('weight').value);
  return weightUnit === 'kg' ? w : w * 0.453592;
}

function classifyBMI(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', cls: 'cat-underweight' };
  if (bmi < 25)   return { label: 'Normal weight', cls: 'cat-normal' };
  if (bmi < 30)   return { label: 'Overweight', cls: 'cat-overweight' };
  if (bmi < 35)   return { label: 'Obese', cls: 'cat-obese' };
  return { label: 'Extremely obese', cls: 'cat-obese-extreme' };
}

function bmiToPercent(bmi) {
  // Map BMI 12-42 to 0-100%
  const clamped = Math.max(12, Math.min(42, bmi));
  return ((clamped - 12) / 30) * 100;
}

function shakeField(el) {
  el.classList.add('input-error');
  setTimeout(() => el.classList.remove('input-error'), 400);
}

function calculate() {
  const heightCm = getHeightInCm();
  const weightKg = getWeightInKg();
  let valid = true;

  if (!heightCm || heightCm < 30 || heightCm > 300) {
    if (heightUnit === 'metric') {
      shakeField(document.getElementById('metricHeight'));
    } else {
      shakeField(document.getElementById('imperialHeight'));
    }
    valid = false;
  }
  if (!weightKg || weightKg < 5 || weightKg > 300) {
    shakeField(document.getElementById('weight').parentElement);
    valid = false;
  }
  if (!valid) return;

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const { label, cls } = classifyBMI(bmi);

  const panel = document.getElementById('resultPanel');
  panel.className = 'result-panel visible ' + cls;

  document.getElementById('bmiValue').textContent = bmi.toFixed(1);
  document.getElementById('bmiCategory').textContent = label;
  document.getElementById('scaleMarker').style.left = bmiToPercent(bmi) + '%';
}

// Allow Enter key to trigger calculation
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') calculate();
});
