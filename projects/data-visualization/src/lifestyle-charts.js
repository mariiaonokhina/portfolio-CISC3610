async function loadCSVData() {
    const response = await fetch('Sleep_health_and_lifestyle_dataset.csv');
    const text = await response.text();
  
    const rows = text.trim().split('\n').slice(1); // skip header
    const data = rows.map(row => {
        const columns = row.split(',');
        if (columns.length < 13) return null;
      
        const [
          id, gender, age, occupation, sleepDuration, quality, activity, stress,
          bmi, bloodPressure, heartRate, steps, disorder
        ] = columns;
      
        return {
          occupation,
          disorder: disorder?.trim() || 'None',
          steps: parseInt(steps)
        };
      }).filter(Boolean);      
  
    return data;
  }
  
  function createDisorderChart(disorderCounts) {
    const ctx = document.getElementById('disorderChart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(disorderCounts),
        datasets: [{
          label: 'Sleep Disorders',
          data: Object.values(disorderCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800']
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Sleep Disorder Distribution - by Mariia Onokhina'
          }
        }
      }
    });
  }
  
  function createStepsChart(avgStepsPerOccupation) {
    const ctx = document.getElementById('stepsChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(avgStepsPerOccupation),
        datasets: [{
          label: 'Average Daily Steps',
          data: Object.values(avgStepsPerOccupation),
          backgroundColor: '#4CAF50'
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: {
          title: {
            display: true,
            text: 'Average Daily Steps by Occupation - by Mariia Onokhina'
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  function countDisorders(data) {
    const disorderCounts = {};
    for (const d of data) {
      disorderCounts[d.disorder] = (disorderCounts[d.disorder] || 0) + 1;
    }
    return disorderCounts;
  }
  
  function averageStepsByOccupation(data) {
    const totals = {};
    const counts = {};
    for (const d of data) {
      if (!totals[d.occupation]) {
        totals[d.occupation] = 0;
        counts[d.occupation] = 0;
      }
      totals[d.occupation] += d.steps;
      counts[d.occupation] += 1;
    }
  
    const avg = {};
    for (const occ of Object.keys(totals)) {
      avg[occ] = Math.round(totals[occ] / counts[occ]);
    }
    return avg;
  }
  
  loadCSVData().then(data => {
    const disorderCounts = countDisorders(data);
    const avgSteps = averageStepsByOccupation(data);
  
    createDisorderChart(disorderCounts);
    createStepsChart(avgSteps);
  });  